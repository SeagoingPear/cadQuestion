const express = require('express')
const sql = require('mysql2')
const server = express()

const bodyParser = require('body-parser')

// const banco = sql.createPool({
//   database: 'juocode',
//   user: 'juocode',
//   password: '',
//   host: 'juocode.mysql.dbaas.com.br',
//   port: '3306'
// })

const banco = sql.createPool({
  database: 'juocode',
  user: 'root',
  password: '',
  host: 'localhost',
  port: '3306'
})

const cors = require('cors')
const corsOptions = {
  origin: 'http://localhost:4200',
  optionSuccessStatus: 200,
}
server.use(cors(corsOptions));

server.use(bodyParser.urlencoded({extended: false}))
server.use(bodyParser.json())

server.get('/', (req, res) => {
    return res.status(200).send("Api de conexão com o banco de dados 'juocode'")
})

//////////////////////////////// Rotas ////////////////////////////////

//=-=-=-=-=-=-=-=-=-=-=-=-=-=-= Users =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//

// Listar usuários
server.get('/users', (req, res) => {
    const QUERY = 'select * from users'

    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({detalhes: error})

        conn.query(QUERY, (erro, resultados) => {
            conn.release()
            if(erro) return res.status(500).send({detalhes: erro})

            return res.status(200).send(resultados)
        })
    })
})

// Listar usuário pelo email
server.get('/user/email/:email', (req, res) => {
    let email = req.params.email
    const QUERY = `select * from users where email = "${email}"`

    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({detalhes: error})

        conn.query(QUERY, (erro, resultados) => {
            conn.release()
            if(erro) return res.status(500).send({detalhes: erro})

            return res.status(200).send(resultados)
        })
    })
})

// Listar usuário pelo userName
server.get('/user/userName/:userName', (req, res) => {
    let userName = req.params.userName
    const QUERY = `select * from users where userName = "${userName}"`

    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({detalhes: error})

        conn.query(QUERY, (erro, resultados) => {
            conn.release()
            if(erro) return res.status(500).send({detalhes: erro})

            return res.status(200).send(resultados)
        })
    })
})

// Listar usuário ordenado pelo xp - Ranging global
server.get('/ranking', (req, res) => {
    const QUERY = 'select * from users order by xp desc'

    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({detalhes: error})

        conn.query(QUERY, (erro, resultados) => {
            conn.release()
            if(erro) return res.status(500).send({detalhes: erro})

            return res.status(200).send(resultados)
        })
    })
})

// Listar usuário ordenado pelo xp por estado - Ranking local
server.get('/ranking/state/:state', (req, res) => {
    let state = req.params.state
    const QUERY = `select * from users where uf = "${state}" order by xp desc`

    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({detalhes: error})

        conn.query(QUERY, (erro, resultados) => {
            conn.release()
            if(erro) return res.status(500).send({detalhes: erro})

            return res.status(200).send(resultados)
        })
    })
})

// Listar usuário ordenado pelo xp por amigos - Rangking amigos
server.get('/ranking/friendList/idUser/:idUser', (req, res) => {
    let idUser = req.params.idUser
    const QUERY = `select f.* from friendlist f join users u on f.users_idUser = u.idUser where f.users_idUser = ${idUser} order by friendXp desc`

    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({detalhes: error})

        conn.query(QUERY, (erro, resultados) => {
            conn.release()
            if(erro) return res.status(500).send({detalhes: erro})

            return res.status(200).send(resultados)
        })
    })
})

// Cadastrar usuário
server.post('/singup', (req, res) => {
    let body = req.body
    const QUERY = `insert into users values(null, "${body.userName}", "${body.name}", "${body.email}", "${body.password}", ${body.xp}, "${body.uf}", ${body.userIcon})`

    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({detalhes: error})

        conn.query(QUERY, erro => {
            conn.release()
            if(erro) return res.status(501).send({detalhes: erro})

            return res.status(201).send('Usuário cadastrado com sucesso!')
        })
    })
})

// Inserir amigo a lista de amigos por idUser  ------------------ URGENTE !
// server.post('/singup/friendlist/idUser/:idUser/idFriend/:idFriend', (req, res) => {
//     let idUser = req.params.idUser
//     let idFriend = req.params.idFriend
//     const FRIENDQUERY = `select * from users where idUser = ${idFriend}`
//     friendData = {}

//     banco.getConnection((error, conn) => {
//         if(error) return res.status(500).send({detalhes: error})

//         conn.query(FRIENDQUERY, (erro, resultados) => {
//             conn.release()
//             if(erro) return res.status(501).send({detalhes: erro})

//             resultados = resultados[0]

//             const CADQUERY = `insert into friendlist values(null, ${idUser}, ${resultados['idUser']}, "${resultados['userName']}", "${resultados['name']}", "${resultados['email']}", ${resultados['xp']}, "${resultados['uf']}", ${resultados['userIcon']})`

//             banco.getConnection((error, conn) => {
//                 if(error) return res.status(500).send({detalhes: error})

//                 conn.query(CADQUERY, erro => {
//                     conn.release()
//                     if(erro) return res.status(501).send({detalhes: erro})

//                     return res.status(201).send('Usuário cadastrado com sucesso!')
//                 })
//             })
//         })
//     })
// })

// Deleta usuário pelo id
server.delete('/deleteUser/:idUser', (req, res) => {
    const idUser = req.params.idUser
    const QUERY = `delete from users where idUser = ${idUser}`

    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({detalhes: error})

        conn.query(QUERY, erro => {
            conn.release()
            if(erro) return res.status(500).send({detalhes: erro})

            return res.status(200).send('Usuário excluído com sucesso!')
        })
    })
})

//=-=-=-=-=-=-=-=-=-=-=-=-=- Questions -=-=-=-=-=-=-=-=-=-=-=-=-=-=//

// Listar questões
server.get('/questions', (req, res) => {
    const QUERY = 'select * from questions'
    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({ detalhes: error })

        conn.query(QUERY, (erro, resultados) => {
            conn.release()
            if(erro) return res.status(500).send({ detalhes: erro })

            return res.status(200).send(resultados)
        })
    })
})

// Listar questões por módulo
server.get('/questions/module/:module', (req, res) => {
    const module = req.params.module
    const QUERY = `select m.moduleName, q.* from questions q join modules m on q.modules_idModule = m.idModule where m.moduleName = '${module}'`
    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({ detalhes: error })

        conn.query(QUERY, (erro, resultados) => {
            conn.release()
            if(erro) return res.status(500).send({ detalhes: erro })

            return res.status(200).send(resultados)
        })
    })
})

// Cadastrar questão
server.post('/cadQuestion', (req, res) => {
    let body = req.body
    const QUERY = `insert into questions values(null, ${body.modules_idModule}, ${body.level}, ${body.floor}, ${body.questionNum}, ${body.bonus}, '${body.questionType}', '${body.question}', '${body.answerC1}', '${body.answerC2}', '${body.answerE1}', '${body.answerE2}', '${body.answerE3}')`

    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({detalhes: error})

        conn.query(QUERY, erro => {
            conn.release()
            if(erro) return res.status(501).send({detalhes: erro})

            return res.status(201).send('Questão cadastrada com sucesso!')
        })
    })
})

// Cadastra uma explicação referênte a uma questão
server.post('/cadExplanation', (req, res) => {
  let body = req.body
  const QUERY = `insert into explanations values(${body.questions_idQuestion}, "${body.explanation}", "${body.imgFlowchart}")`

  banco.getConnection((error, conn) => {
    if(error) return res.status(500).send({detalhes: error})
    conn.query(QUERY, erro => {
      conn.release()
      if(erro) return res.status(501).send({detalhes: erro})

      return res.status(201).send('Explicação cadastrada com sucesso!')
    })
  })
})

// Cadastra link de uma questão
server.post('/cadLink', (req, res) => {
  let body = req.body
  const QUERY = `insert into links values(null, ${body.explanations_questions_idQuestion}, "${body.linkType}", "${body.link}")`

  banco.getConnection((error, conn) => {
    if(error) return res.status(500).send({detalhes: error})
    conn.query(QUERY, erro => {
      conn.release()
      if(erro) return res.status(501).send({detalhes: erro})

      return res.status(201).send('Link cadastrado com sucesso!')
    })
  })
})

// Deleta questão pelo id
server.delete('/deleteQuestion/:idQuestion', (req, res) => {
    const idQuestion = req.params.idQuestion
    const QUERY = `delete from questions where idQuestion = ${idQuestion}`

    banco.getConnection((error, conn) => {
        if(error) return res.status(500).send({detalhes: error})

        conn.query(QUERY, erro => {
            conn.release()
            if(erro) return res.status(500).send({detalhes: erro})

            return res.status(200).send('Questão excluída com sucesso!')
        })
    })
})

//=-=-=-=-=-=-=-=-=-=-=-=-=-=- Outros -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=//

// Listar módulos
server.get('/modules', (req, res) => {
  const QUERY = `select * from modules`

  banco.getConnection((error, conn) => {
    if(error) return res.status(500).send({detalhes: error})

    conn.query(QUERY, (erro, resultados) => {
      conn.release()
      if(erro) return res.status(500).send({detalhes: erro})

      return res.status(200).send(resultados)
    })
  })
})

server.listen(3000, () => { console.log('Server running in: \033[36mhttp://localhost:3000/\033[m')})
