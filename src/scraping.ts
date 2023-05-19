import yargs from 'yargs';
import {isNil} from 'ramda';
import { getContent } from './puppeteer';

const args = yargs
    .command("* <url>", "")
    .parseSync()
;

const url: string = isNil(args.url) ? "" : args.url as string;

console.log(url);
(async() => {
    const content = await getContent(url);
    console.log(content);
});

