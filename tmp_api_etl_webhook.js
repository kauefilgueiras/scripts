const envs = {
    endpoint: "[ENDPOINT]",
    webhook: "[WEBHOOK]"
};

const { endpoint, webhook } = envs;

const fetch_api = async ({ endpoint }) => {
    const res = await fetch(endpoint)
    return res.json();
}

// Mapeamento das propriedades retornadas no endpoint (varia pra cada api)
const transform_api_data = data =>
    data.results.map(({ name, url }) => ({
        Nome: name,
        URL: url
    }));

const send_data_to_webhook = async (url, payload) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });
        return await response.json();
    } catch (error) {
        console.error("Erro no POST:", error);
    }
};

const execute_pipeline = async ({ endpoint, webhook }) => {
    try {
        const response = await fetch_api({ endpoint });
        const transformed = transform_api_data(response);
        const sendData = await send_data_to_webhook(webhook, transformed);
        console.log("Resposta do webhook:", sendData);
    } catch (err) {
        console.error("Erro na API:", err);
    }
};

execute_pipeline({
    endpoint,
    webhook
});
