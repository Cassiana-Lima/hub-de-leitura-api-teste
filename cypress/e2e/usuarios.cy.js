/// <reference types= "cypress"/>

let token
beforeEach(() => {
    cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
        token = tkn
    })
});

describe('GET - Teste de API - Gestao de usuarios', () => {

    it('Deve listar usuarios com sucesso', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.users).to.be.an('array')
        })
    });
    it('Deve validar propriedades de um usuario', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.users[0]).to.have.property('id')
            expect(response.body.users[0]).to.have.property('name')
            expect(response.body.users[0]).to.have.property('email')
        })
    });
    it('Deve listar um usuario com sucesso buscando ID', () => {
        cy.api({
            method: 'GET',
            url: 'users/2',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body).to.have.property('id')
            expect(response.body).to.have.property('name')
            expect(response.body).to.have.property('email')
        })
    });
    it('Deve listar usuario com sucesso usando filtro - parametros', () => {
        cy.api({
            method: 'GET',
            url: 'users',
            headers: { 'Authorization': token },
            qs: {
                page: 1,
                limit: 20,
                search: 'Usuário'
            }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.users[0]).to.have.property('id')
        })

    });

})

describe('POST - Teste de API - Gestao de usuarios', () => {
    it('Deve cadastrar um usuario com sucesso', () => {
        let email = `jjaasia${Date.now()}@email.com`
        cy.api({
            method: 'POST',
            url: 'users',
            body: {
                "name": "Maria Souza",
                "email": email,
                "password": "senha123"
            }
        }).should(response => {
            expect(response.status).to.equal(201)
            expect(response.body.message).to.equal('Usuário criado com sucesso.')
        })
    });
    it('Deve validar um usuario com email invalido', () => {
        cy.api({
            method: 'POST',
            url: 'users',
            body: {
                "name": "Maria Souza",
                "email": "jjaaemail.com",
                "password": "senha123"
            },
            failOnStatusCode: false
        }).should(response => {
            expect(response.status).to.equal(400)
            expect(response.body.message).to.equal('Formato de email inválido.')
        });

    });
});

describe('PUT - Teste de API - Gestao de usuarios ', () => {
    it('Deve atualizar um usuario com sucesso', () => {
        cy.api({
            method: 'PUT',
            url: 'users/260',
            headers: { 'Authorization': token },
            body: {
                name: "maria Silva Alterado",
                email: "maria.novo.alterado@email.com",
                password: "novaSenha123alterada"
            }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Usuário atualizado com sucesso.')
        });
    });
    it('Deve atualizar um usuario com sucesso - de forma dinamica', () => {
        let email = `cassiana${Date.now()}@email.com`
        cy.cadastrarUsuario('Cassiana Lima', email, 'senha123').then(userId => {
            cy.log(userId)
            cy.api({
                method: 'PUT',
                url: 'users/' + userId,
                headers: { 'Authorization': token },
                body: {
                    name: "maria Silva Alterado",
                    email: email,
                    password: "novaSenha123alterada"
                }
            }).should(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Usuário atualizado com sucesso.')
            });
        })
    });
});

describe('DELETE - Teste de API - Gestao de usuarios', () => {
    it.skip('Deve excluir um usuario com sucesso', () => {
        cy.api({
            method: 'DELETE',
            url: 'users/269',
            headers: { 'Authorization': token }
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.message).to.equal('Usuário removido com sucesso.')
        })
    });
    it('Deve excluir um usuario com sucesso - de forma dinamica', () => {
        cy.cadastrarUsuario('Cassiana para deletar', 'deletar@deletar.com', 'senha123').then(userId => {
            cy.api({
                method: 'DELETE',
                url:`users/${userId}`,
                headers: { 'Authorization': token }
            }).should(response => {
                expect(response.status).to.equal(200)
                expect(response.body.message).to.equal('Usuário removido com sucesso.')
            })
        })

    });

});