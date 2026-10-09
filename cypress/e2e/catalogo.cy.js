/// <reference types= "cypress"/>
import { faker } from '@faker-js/faker'

let token
beforeEach(() => {
    cy.geraToken('admin@biblioteca.com', 'admin123').then(tkn => {
        token = tkn
    })
});

describe('GET - Teste de API - Catalogo de Livros', () => {
    it('Deve listar todos os livros com sucesso', () => {
        cy.api({
            method: 'GET',
            url: 'books'
        }).should(response => {
            expect(response.status).to.equal(200)
            expect(response.body.books).to.be.an('array')
        })
    });
    it('Deve listar as categorias disponiveis com sucesso', () => {
        cy.api({
            method: 'GET',
            url: 'books'
        }).should(response => {
            expect(response.status).to.be.equal(200)
            expect(response.body.books).to.be.an('array')
        })
    });
    it('Deve listar os autores disponiveis com sucesso', () => {
        cy.api({
            method: 'GET',
            url: 'books'
        }).should(response => {
            expect(response.status).to.be.equal(200)
            expect(response.body.books).to.be.an('array')
        })
    });
})

describe('POST - Teste de API - Catalogo de Livros', () => {
    it('Deve cadastrar um novo livro com sucesso', () => {
        let livro = faker.book.title()
        let autor = faker.book.author()
        cy.api({
            method: 'POST',
            url: 'books',
            headers: { 'Authorization': token },
            body: {
                "title": livro,
                "author": autor,
            }

        }).should(response => {
            expect(response.status).to.be.equal(201)
            expect(response.body.message).to.be.equal('Livro criado com sucesso.')
        })
    });
});

describe('PUT - Teste de API - Catalogo de Livros', () => {
    it(' Deve atualizar um livro com sucesso', () => {
        cy.cadastrarLivro('Livro para Alteracao', 'Fulano', token).then(bookId => {
            cy.api({
                method: 'PUT',
                url: `books/${bookId}`,
                headers: { 'Authorization': token },
                body: {
                    "title": "Nome livro atualizado",
                    "author": "Autor Atualizado",
                },

            }).should(response => {
                expect(response.status).to.be.equal(200)
                expect(response.body.message).to.equal('Livro atualizado com sucesso.')
            })

        })
    })

});

describe('DELETE - Teste de API - Catalogo de Livros', () => {
    it('Deve excluir um livro com sucesso de forma dinamica', () => {
        let livro = faker.book.title()
        let autor = faker.book.author()
        cy.cadastrarLivro(livro, autor, token).then(bookId => {
            cy.api({
                method: 'DELETE',
                url: `books/${bookId}`,
                headers: { 'Authorization': token }
            }).should(response => {
                expect(response.status).to.be.equal(200)
                expect(response.body.message).to.be.equal('Livro deletado com sucesso.')

            })
        })

    });

});

