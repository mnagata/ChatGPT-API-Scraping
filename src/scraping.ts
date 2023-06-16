import yargs from 'yargs';
import {isNil} from 'ramda';
import { getContent } from './puppeteer';
import { extractMenu } from './functionClall';

const args = yargs
    .command("* <url>", "スクレイピングするURL")
    .parseSync()
;

const url: string = isNil(args.url) ? "" : args.url as string;

const htmlShaping = (str: string, extractTags: any): string => {
    // 配列形式の場合は'|'で結合
    if ((Array.isArray ? Array.isArray(extractTags)  : Object.prototype.toString.call(extractTags) === '[object Array]')) {
        extractTags = extractTags.join('|');
    }

    // パターンを動的に生成
    const pattern = new RegExp('<(' + extractTags + ')[^>]*?>[\\s\\S]*?<\\/(' + extractTags + ')>', 'gim');

    // htmlタグ削除
    str = str.replace(/<!--[\s\S]*?-->/g,'');
    str = str.replace(pattern, '');

    str = str.replace(/ class="[\s\S]*?"/g, '');
    str = str.replace(/ style="[\s\S]*?"/g, '');
    str = str.replace(/ href="[\s\S]*?"/g, '');
    str = str.replace(/ id="[\s\S]*?"/g, '');
    str = str.replace(/ role="[\s\S]*?"/g, '');
    str = str.replace(/ target="[\s\S]*?"/g, '');

    str = str.replace(/<br>/g, '');
    str = str.replace(/<div>/g, '');
    str = str.replace(/<\/div>/g, '');
    str = str.replace(/<li>/g, '');
    str = str.replace(/<\/li>/g, '');
    str = str.replace(/<ul>/g, '');
    str = str.replace(/<\/ul>/g, '');
    str = str.replace(/<a>/g, '');
    str = str.replace(/<\/a>/g, '');

    // 空白を削除
    str = str.replace(/^[\ \t\r\n]+/mg, '');
    str = str.replace(/\s{2}/g, '');

    return str;
};

(async() => {
    const content = await getContent(url);
    const tags =  ['script', 'style', 'svg', 'noscript', 'iframe', 'header', 'footer', 'link', 'meta', 'picture', 'select', 'section', 'input', 'label', 'h1', 'h2'];
    //console.log(htmlShaping(content, tags).substring(0, 5000));
    const menu = await extractMenu( htmlShaping(content, tags).substring(0, 5000) );
    console.log(menu);
})();

