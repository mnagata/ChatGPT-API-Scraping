import { Configuration, OpenAIApi, ChatCompletionRequestMessage, CreateChatCompletionResponse } from 'openai';
import { isNil } from 'ramda';

// 初期値に役割を与える
const chatMessage: Array<ChatCompletionRequestMessage> = [
    { role: 'system', content: '入力されたhtml文字列からメニューの商品名と価格をcsv形式で出力してください'}
];

// ChatGPT API
const chatGptAask = async (): Promise<CreateChatCompletionResponse> => {
    const response = await openai.createChatCompletion({
        //model: 'gpt-3.5-turbo-0301',
        model: 'gpt-4',
        messages: chatMessage
    });

    return response.data;
}

const configuration = new Configuration({
    organization: process.env.OPENAI_ORGANIZATION,
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

export const extractMenu = async (content: string): Promise<String> => {
    chatMessage.push({ role: 'user', content: content});
    const responseData = await chatGptAask();
    const assistantContext = responseData.choices[0].message?.content;

    return isNil(assistantContext) ? "" : assistantContext;
};
