import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;
const BUCKET_NAME = 'disclosure-documents';

const inputDir = 'd:\\open-iruma\\開示請求\\まとめ資料';
const outputJsonPath = path.join(process.cwd(), 'data', 'disclosure_data.json');

// Ensure data dir exists
if (!fs.existsSync(path.dirname(outputJsonPath))) {
    fs.mkdirSync(path.dirname(outputJsonPath), { recursive: true });
}

// Check if qpdf is installed for PDF linearization
let hasQpdf = false;
try {
    execSync('qpdf --version', { stdio: 'ignore' });
    hasQpdf = true;
    console.log('qpdf is available. PDFs will be linearized.');
} catch (e) {
    console.warn('⚠️ qpdf is not installed. PDF linearization will be skipped.');
    console.warn('   For mobile performance, please install qpdf (e.g. brew install qpdf or apt-get install qpdf).');
}

// Categorization Logic (Dictionary based)
function categorize(title) {
    // 4大特集 (Special Themes)
    if (title.includes('庁舎') || title.includes('地区センター') || title.includes('公共施設') || title.includes('市民会館')) {
        return { specialTopic: 'city-hall', category: null };
    }
    if (title.includes('脱炭素') || title.includes('EV') || title.includes('電力') || title.includes('e-MIRAI') || title.includes('エコ')) {
        return { specialTopic: 'green-energy', category: null };
    }
    if (title.includes('パーパス') || title.includes('プロモーション') || title.includes('ご当地映画') || title.includes('成人式') || title.includes('観光')) {
        return { specialTopic: 'city-promotion', category: null };
    }
    if (title.includes('市長公約') || title.includes('公務日程') || title.includes('政治資金') || title.includes('公約') || title.includes('タウンミーティング') || title.includes('選挙')) {
        return { specialTopic: 'governance', category: null };
    }
    
    // 6大分野 (Categories)
    if (title.includes('留保地') || title.includes('橋') || title.includes('鉄道') || title.includes('都市計画') || title.includes('道路') || title.includes('開発')) {
        return { specialTopic: null, category: 'urban-planning' };
    }
    if (title.includes('環境') || title.includes('ごみ') || title.includes('衛生')) {
        return { specialTopic: null, category: 'environment' };
    }
    if (title.includes('広報') || title.includes('イベント')) {
        return { specialTopic: null, category: 'public-relations' };
    }
    if (title.includes('議会') || title.includes('要望') || title.includes('アイディア') || title.includes('市民対話')) {
        return { specialTopic: null, category: 'administration' };
    }
    if (title.includes('ハラスメント') || title.includes('退職者') || title.includes('人事') || title.includes('労務') || title.includes('職員')) {
        return { specialTopic: null, category: 'personnel' };
    }
    if (title.includes('商品券') || title.includes('補助金') || title.includes('学童') || title.includes('福祉') || title.includes('教育') || title.includes('姉妹都市') || title.includes('万博') || title.includes('ドック') || title.includes('こども')) {
        return { specialTopic: null, category: 'education-welfare' };
    }

    return { specialTopic: null, category: 'education-welfare' }; // Default
}

// Generate MD5 hash of file content
function getFileHash(filePath) {
    const fileBuffer = fs.readFileSync(filePath);
    const hashSum = crypto.createHash('md5');
    hashSum.update(fileBuffer);
    return hashSum.digest('hex');
}

async function uploadToSupabase(filePath, originalFileName) {
    if (!supabase) return null;
    
    const hash = getFileHash(filePath);
    const ext = path.extname(filePath);
    const storagePath = `${hash}${ext}`;
    let uploadPath = filePath;

    // Linearize if qpdf is available and it's a PDF
    if (hasQpdf && ext.toLowerCase() === '.pdf') {
        // use system temp dir to be safe
        const tempPath = path.join(process.cwd(), `${hash}_linearized.pdf`);
        try {
            execSync(`qpdf --linearize "${filePath}" "${tempPath}"`);
            uploadPath = tempPath;
        } catch (e) {
            console.error(`Failed to linearize ${filePath}:`, e.message);
        }
    }

    try {
        const fileData = fs.readFileSync(uploadPath);
        
        // Upload (upsert avoids duplicate errors for same hash)
        const { data, error } = await supabase.storage
            .from(BUCKET_NAME)
            .upload(storagePath, fileData, {
                contentType: ext.toLowerCase() === '.pdf' ? 'application/pdf' : 'application/octet-stream',
                upsert: true
            });
            
        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(storagePath);
            
        // clean up temp file
        if (uploadPath !== filePath && fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath);
        }

        return publicUrlData.publicUrl;
    } catch (e) {
        console.error(`Upload error for ${originalFileName}:`, e.message);
        if (uploadPath !== filePath && fs.existsSync(uploadPath)) {
            fs.unlinkSync(uploadPath);
        }
        return null;
    }
}

async function main() {
    console.log('--- Starting Disclosure Sync ---');
    const files = fs.readdirSync(inputDir).filter(f => f.endsWith('.md'));
    const allItems = [];
    let itemIdCounter = 1;

    for (const file of files) {
        const content = fs.readFileSync(path.join(inputDir, file), 'utf-8');
        const lines = content.split('\n');
        let period = file.replace('.md', '').replace(/^\d+_/, ''); 
        
        let currentItem = null;
        
        for (const line of lines) {
            const itemMatch = line.match(/^- \*\*(\d+)\.\s*(.+?)\*\*/);
            if (itemMatch) {
                if (currentItem) allItems.push(currentItem);
                
                const title = itemMatch[2].trim();
                const { specialTopic, category } = categorize(title);
                
                currentItem = {
                    id: `req-${period.replace(/[^a-zA-Z0-9]/g, '')}-${itemIdCounter++}`,
                    title: title,
                    period: period,
                    department: "不明", 
                    specialTopic: specialTopic,
                    category: category,
                    status: 'OPEN',
                    files: []
                };
            } else if (currentItem) {
                if (line.includes('🔴 **[結果/注記]** 開示・不開示・一部開示:')) {
                    if (line.includes('不開示')) currentItem.status = 'CLOSED';
                    else if (line.includes('一部開示')) currentItem.status = 'PARTIAL';
                    else if (line.includes('不存在')) currentItem.status = 'NON_EXISTENT';
                    else currentItem.status = 'OPEN';
                }
                
                const fileMatch = line.match(/- 📄 \[(.+?)\]\((file:\/\/\/.+?)\)/);
                if (fileMatch) {
                    let relPath = fileMatch[2].replace('file:///d:/X運用/開示請求/公開用/', '');
                    relPath = decodeURIComponent(relPath);
                    const localPath = path.join('d:\\open-iruma\\開示請求\\公開用', relPath);
                    
                    if (fs.existsSync(localPath)) {
                        const stats = fs.statSync(localPath);
                        currentItem.files.push({
                            fileName: fileMatch[1],
                            filePathLocal: localPath,
                            fileSize: stats.size,
                            publicUrl: null 
                        });
                    }
                }
            }
        }
        if (currentItem) allItems.push(currentItem);
    }
    
    console.log(`Parsed ${allItems.length} disclosure items.`);
    
    if (!supabase) {
        console.log('No Supabase credentials found. Skipping upload step and using local paths.');
    }

    let uploadCount = 0;
    for (const item of allItems) {
        for (let i = 0; i < item.files.length; i++) {
            const fileObj = item.files[i];
            
            const fileHash = getFileHash(fileObj.filePathLocal);
            const ext = path.extname(fileObj.filePathLocal);
            fileObj.id = fileHash; 
            
            if (supabase) {
                console.log(`Uploading ${fileObj.fileName}...`);
                const url = await uploadToSupabase(fileObj.filePathLocal, fileObj.fileName);
                if (url) {
                    fileObj.publicUrl = url;
                    uploadCount++;
                }
            }
            
            delete fileObj.filePathLocal;
        }
    }
    
    if (supabase) console.log(`Uploaded ${uploadCount} files to Supabase.`);
    
    fs.writeFileSync(outputJsonPath, JSON.stringify(allItems, null, 2), 'utf-8');
    console.log(`✅ Saved generated JSON to ${outputJsonPath}`);
    console.log('--- Sync Complete ---');
}

main().catch(console.error);
