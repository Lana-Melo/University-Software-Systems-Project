// -----
// controllers/userController.js
// -----

// Para usar o modelo de utilizador definido em Mongoose.
const User = require('../models/userModel');

// Para cifrar dados, em particular senhas de utilizadores.
const bcrypt = require('bcrypt');

// Para gerir tokens válidos durante sessões de uso da API.
const jwt = require('jsonwebtoken');

// -----

// Valor de salt rounds para uso no bcrypt.
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);

// Chave usada na geração de JSON Web Tokens.
const JWT_SECRET = process.env.JWT_SECRET;

// Validade de um JSON Web Token.
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION;

// -----

// Funções com a lógica de resposta a pedidos da API relativos
// a utilizadores. Todas estas funções têm dois parâmetros:
//  - req: dá acesso aos dados do pedido; e
//  - res: permite compor a resposta ao cliente.

// -----

// Registo de um novo utilizador.
exports.create = async (req, res) => {

  try {
    // Dados do novo utilizador vêm no corpo do pedido.
    const { username, email, password, name, mobile, address } = req.body;

    // Não pode existir um outro utilizador na
    // base de dados com o mesmo username ou email.
    const existingUser = await User.findOne({ $or: [{username}, {email}] });

    if (existingUser) {
      // 409 = Conflict.
      return res.status(409).json({
        success: false, 
        message: 'Username ou email já registados.'
      });
    }

    // O novo utilizador pode ser registado na base de dados,
    // mas antes disso a sua password vai ser cifrada.

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const newUser = new User({
      username: username,
         email: email,
      password: passwordHash,  // Cifrada, em vez de em claro.
          name: name,
        mobile: mobile,
       address: address
    });

    // Se não for possível gravar os dados do utilizador,
    // o processamento passa para o bloco catch da função.
    await newUser.save();

    // 201 = Created.
    res.status(201).json({
      success: true,
      message: 'Utilizador registado com sucesso.',
         user: { username: newUser.username, email: newUser.email,
                 password: newUser.password,  name: newUser.name,
                   mobile: newUser.mobile, address: newUser.address,
                      _id: newUser._id }
    });

  } catch (error) {
    // 500 = Internal server error.
    res.status(500).json({
      success: false, 
      message: 'Erro do servidor durante o registo de um utilizador.'
    });

    // O que terá acontecido?
    console.error(error);
  }
}

// -----

// Remoção de um utilizador pelo seu próprio identificador de MongoDB (_id).
exports.delete = async (req, res) => {

  try {
    // Identificador do utilizador a remover vem num parâmetro do pedido.
    const userId = req.params.id;

    // A remoção de um utilizador requer que esse utilizador tenha
    // feito previamente login e que o token JWT ainda esteja válido.
    const token = req.token;

    if (!token) {
      // 401 = Unauthorized.
      return res.status(401).json({
        success: false,
        message: 'Necessário login antes do utilizador poder ser removido.'
      });
    }

    let payload = null;

    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      // 401 = Unauthorized.
      return res.status(401).json({
        success: false,
        message: 'Token de sessão já não está válido. Necessário novo login.'
      });
    }

    // Mesmo com login efetuado, um utilizador não pode remover os dados
    // de outros utilizadores. Ou seja, o ID no payload do JWT (do utilizador
    // que fez login) tem de ser igual ao ID do utilizador a remover.
    if (userId !== payload.id) {
      // 403 = Forbidden.
      return res.status(403).json({
        success: false,
        message: 'Um utilizador não pode apagar o registo de outro utilizador.'
      });
    }

    // Se o utilizador a remover não existir, devolve null.
    const deletedUserDocument = await User.findByIdAndDelete(userId);

    if (!deletedUserDocument) {
      // 404 = Not Found.
      return res.status(404).json({
        success: false, 
        message: 'Utilizador a remover não existe.'
      });
    }

    // 200 = Created.
    res.status(200).json({ 
      success: true, 
      message: 'Utilizador removido com sucesso.',
      deleted: deletedUserDocument 
    });

  } catch (error) {
    // 500 = Internal Server Error.
    res.status(500).json({
      success: false, 
      message: 'Erro do servidor durante a remoção de um utilizador.'
    });

    // O que terá acontecido?
    console.error(error);
  }
}

// -----

// Login de um utilizador.
exports.login = async (req, res) => {

  try {
    // Dados do utilizador vêm no corpo do pedido.
    // O identifier tanto pode ser o username como o email.
    const { identifier, password } = req.body;

    // Encontrar o utilizador com base no username ou e-mail
    const user = await User.findOne({ $or: [{ username: identifier },
                                            {    email: identifier }] });

    if (!user) {
      // 401 = Unauthorized.
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.'
      });
    }

    // O utilizador existe, sendo necessário decifrar
    // a sua password, proveniente da base de dados.

    const passwordHashFromDB = user.password;
    const match = await bcrypt.compare(password, passwordHashFromDB);

    if (!match) {
      // 401 = Unauthorized.
      return res.status(401).json({
        success: false,
        message: 'Credenciais inválidas.'
      });
    }

    // A password está correta, pelo que vai ser gerado um token JWT (JSON Web
    // Token), com claims acerca de quem é o utilizador e do tempo de validade
    // de uma sessão de uso da API. A vantagem do uso de JWT é o servidor
    // não precisar de guardar estado sobre as sessões ativas.

    // Payload com claims acerca do utilizador.
    const payload = {
            id: user._id,       // _id é o ID de documento gerado pelo MongoDB.
      username: user.username
    };

    const token = jwt.sign(payload, JWT_SECRET, { 
      expiresIn: TOKEN_EXPIRATION 
    });

    // 200 = OK.
    res.status(200).json({
      success: true,
      message: 'Login bem sucedido.',
         user: { username: user.username,
                     name: user.name,
                       id: user._id },
         // Token JWT também é devolvido na resposta e
         // pode ser usado em posteriores pedidos à API.
         token
    });

  } catch (error) {
    // 500 = Internal Server Error.
    res.status(500).json({
      success: false, 
      message: 'Erro do servidor durante o login de um utilizador.'
    });

    // O que terá acontecido?
    console.error(error);
  }
};

// -----
