import { Configuration, OpenAIApi, ChatCompletionRequestMessage, CreateChatCompletionResponse } from 'openai';
import { isNil } from 'ramda';

const menuChema = {
    "type": "object",
    "properties": {
        "menu": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "description": "メニューの商品名"
                    },
                    "price": {
                        "type": "number",
                        "description": "メニューの商品価格"
                    }            
                }
            },
        },
    },    
    "required": ["html"]
};

// 初期値に役割を与える
const chatMessage: Array<ChatCompletionRequestMessage> = [
    { role: 'system', content: '入力されたhtml文字列からメニューの商品名と価格を抽出する'}
];

// ChatGPT API Function Call
const chatGptAask = async (): Promise<CreateChatCompletionResponse> => {
    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo-16k-0613',
        //model: 'gpt-3.5-turbo-0613',
        messages: chatMessage,
        functions: [
            { name: 'set_definition', parameters: menuChema }
        ],
        function_call: { name: 'set_definition' }
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
    const functionCallArguments = responseData.choices[0].message?.function_call?.arguments;

    return isNil(functionCallArguments) ? "" : functionCallArguments;
};
