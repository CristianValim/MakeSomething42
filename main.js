const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

const UID =
	"u-s4t2ud-ce1965e25fffc3532253d8673f8de7726a2a4517f02179908b14090e61cb70ad";
const SECRET =
	"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";

app.get("/42api/:login", async (req, res) => {
	try {
		// Obter o token de acesso
		const tokenResponse = await axios.post(
			"https://api.intra.42.fr/oauth/token",
			{
				grant_type: "client_credentials",
				client_id: UID,
				client_secret: SECRET,
			},
		);

		const accessToken = tokenResponse.data.access_token;
		console.log(`Access Token: ${accessToken}`);

		// Obter o login do usuário a partir dos parâmetros da URL
		const userLogin = req.params.login;

		// Fazer a requisição para obter os dados do usuário
		const apiResponse = await axios.get(
			`https://api.intra.42.fr/v2/users/${userLogin}`,
			{
				headers: {
					Authorization: `Bearer ${accessToken}`,
				},
			},
		);

		// Enviar a resposta com os dados do usuário
		res.json(apiResponse.data);
	} catch (error) {
		console.error(error);
		res.status(500).json({ error: error.message });
	}
});

app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});
