process.env.NODE_ENV = 'test';
var should = require('should');
var userModel = require('../models/user');
var beerModel = require('../models/beer');
var pubModel = require('../models/pub');
var menuModel = require('../models/menu');
var entryMenuModel = require('../models/entryMenu');
var assert = require('assert');
var request = require('supertest');
var jwt = require('jsonwebtoken');
var serverToken = require('../configs/JWT');
var url = ('http://10.11.1.5:8001');
var http = require('http');
var app = require('../app');
app.settings.connection.close(function(){
    require('../configs/dbTestConnection');
});
var jwt = require('jsonwebtoken');
var jwtConfig = require('../configs/JWT');
var testBeer = {name: 'test', type: 'test', alcoholic_degree: '1'};
var testBeer2 = {name: 'test', type: 'test', alcoholic_degree: '2'};


before(function (done) {
    server = http.createServer(app);
    var port = process.env.PORT || '8001';
    app.set('port', port);
    server.listen(port);
    done();
});

after(function (done) {
    server.close();
    done();
});

describe.skip('Test users', function () {

    // beforeEach(function (done) {
    //     body = {
    //         name: 'gabriele',
    //         username: 'gabriele',
    //         password: 'gabriele'
    //     };
    //
    //     var user = new userModel(body);
    //     user.save(function (err, user) {
    //         if(err){throw err;};
    //         request('http://localhost:8080').post('/authenticate').send({email: body.email, password: body.password}).end(function (err, res) {
    //             userModel.findById(user._id, function (err, user) {
    //                 if(err){throw err;};
    //                 currentUser = user;
    //                 done();
    //             });
    //         });
    //     });
    //
    // });

    // afterEach(function (done) {
    //     userModel.findById(currentUser._id,function (err, user) {
    //         if(user)
    //             user.remove(function (err) {
    //                 if(err) throw err;
    //             });
    //     });
    //     done();
    // });

    it('user authentication, fails due to a non-existent user', function (done) {
        request(url).post('/login').send({username: 'username', password: 'password'}).end(function (err, res) {
            res.header.should.not.have.property('location');
            done();
        });
    });

    it('user authentication, passing', function(done){
        request(url).post('/register').send({username: 'test', password: 'test', name: 'test'}).end(function(err, user){
            request(url).post('/login').send({username: 'test', password: 'test'}).end(function (err, res) {
                res.header.should.have.property('location', '/');
                userModel.remove({username: 'test'}, function (err) {
                    done();
                });
            });
        });
    });

    it('user registration, fails due to a duplicated username', function(done) {
        userModel.create({username: 'test', pasword: 'test'}, function (err, user) {
            request(url).post('/register').send({username: 'test', password: 'test'}).end(function (err, res) {
                res.header.should.not.have.property('location');
                userModel.remove({username: 'test'}, function (err) {
                    done();
                });
            });
        });
    });

    it('user registration, passing', function(done) {
        request(url).post('/register').send({username: 'test', password: 'test', name: 'test'}).end(function (err, res) {
            res.header.should.have.property('location','/login');
            userModel.remove({username: 'test'}, function (err) {
                done();
            });
        });
    });

    it('access denied to /beers, user not logged', function(done) {
        request(url).get('/beers').end(function(err, res) {
            res.header.should.have.property('location', '/login');
            done();
        });
    });

    it('access denied to /pubs, user not logged', function(done) {
        request(url).get('/pubs').end(function(err, res) {
            res.header.should.have.property('location', '/login');
            done();
        });
    });

    it('access granted to /pubs, user logged', function(done) {
        var token = jwt.sign({username: 'test'}, jwtConfig.secret, {expiresIn: 600});
        request(url).get('/pubs').set('Cookie', ['PNB_token='+token]).end(function(err, res){
            res.header.should.not.have.property('location');
            done();
        });
    });

    it('access granted to /beers, user logged', function(done) {
        var token = jwt.sign({username: 'test'}, jwtConfig.secret, {expiresIn: 600});
        request(url).get('/beers').set('Cookie', ['PNB_token='+token]).end(function(err, res){
            res.header.should.not.have.property('location');
            done();
        });
    });

    it('access denied to /login, user already logged', function(done) {
        var token = jwt.sign({username: 'test'}, jwtConfig.secret, {expiresIn: 600});
        request(url).get('/login').set('Cookie', ['PNB_token='+token]).end(function(err, res){
            res.header.should.have.property('location','/');
            done();
        });

    });

    it('access denied to /register, user already logged', function(done) {
        var token = jwt.sign({username: 'test'}, jwtConfig.secret, {expiresIn: 600});
        request(url).get('/register').set('Cookie', ['PNB_token='+token]).end(function(err, res){
            res.header.should.have.property('location','/');
            done();
        });
    });


});

/*
*-------------------------------Test Beers----------------------------
*/
describe('Test beers', function () {

    it('Creazione di una birra', function (done) {
        request(url).post('/beers').send({name: 'new_beer', type: 'test_beer', alcoholic_degree: '5'})
        .end(function (err, res) {
            res.header.should.have.property('location', '/beers/create?message=beer%20inserted%20correctly');
            beerModel.remove({name: 'new_beer'}, function (err) {
                done();
            });
        });
    });


    it('Rimozione di una birra, unit', function (done) {
        beerModel.create(testBeer, function (err, beer) {
            request(url).delete('/beers/' + beer._id).end(function (err, res) {
                res.should.have.property('status', 302);
                beerModel.findById(beer._id, function (err, beer) {
                    should(beer).not.be.ok();
                    res.header.should.have.property('location', '/beers');
                });
            });
        });
        done();
    });



    it('Rimozione di una birra, end-to-end', function (done) {
        request(url).post('/beers').send({
            name: 'will_removed_beer', type: 'test_beer', alcoholic_degree: '5'
        }).end(function (err, res) {
            beerModel.findOne({name: 'will_removed_beer'}, function (err, beer) {
                request(url + '/beers').delete('/' + beer._id).send(beer).end(function (err, res) {
                    beerModel.findById(beer._id, function (err, empty_beer) {
                        should(empty_beer).not.be.ok();
                        res.header.should.have.property('location', '/beers');
                    });
                    done();
                });
            });
        });
    });


    it('Modifica di una birra', function (done) {
        beerModel.create(testBeer, function (err, beer) {
            var mod = {
                name: 'modname',
                type: 'modtype',
                alcoholic_degree: 50
            };
            request(url).put('/beers/' + beer._id).send(mod).end(function (err, res) {
                beerModel.findById(beer._id, function (err, beer) {
                    should(beer).be.ok();
                    beer.should.have.property('name', 'modname');
                    beer.should.have.property('type', 'modtype');
                    beer.should.have.property('alcoholic_degree', 50);
                    beerModel.findByIdAndRemove(beer._id, function (err, result) {
                        done();
                    });
                });
            });
        });
    });


    it('Modifica fallita di una birra, birra già esistente', function (done) {
        beerModel.create(testBeer, function (err, beer1) {
            beerModel.create(testBeer2, function (err, beer2) {
                var mod = {
                    name: 'test',
                    type: 'test',
                    alcoholic_degree: 1
                };
                request(url).put('/beers/' + beer2._id).send(mod).end(function (err, res) {
                    beerModel.findById(beer1._id, function (err, beer) {
                        should(beer).be.ok();
                        beer.should.have.property('name', 'test');
                        beer.should.have.property('type', 'test');
                        beer.should.have.property('alcoholic_degree', 1);
                    });
                    beerModel.findById(beer2._id, function (err, beer) {
                        should(beer).be.ok();
                        beer.should.have.property('name', 'test');
                        beer.should.have.property('type', 'test');
                        beer.should.have.property('alcoholic_degree', 2);
                    });
                    beerModel.findByIdAndRemove(beer1._id, function (err, result) {
                        beerModel.findByIdAndRemove(beer2._id, function (err, result) {
                            done();
                        });
                    });
                });
            });
        });
    });


    it('Ricezione di tutte le birre', function (done) {
        beerModel.create(testBeer, function (err, beer1) {
            beerModel.create(testBeer2, function (err, beer2) {
                request(url).get('/beers').end(function (err, res) {
                    res.text.should.containEql(beer1._id);
                    res.text.should.containEql(beer2._id);
                    beerModel.findByIdAndRemove(beer1._id, function (err, result){});
                    beerModel.findByIdAndRemove(beer2._id, function (err, result){});
                    done();
                });
            });
        });
    });


    it('Ricezione di una birra', function (done) {
        beerModel.create(testBeer, function (err, beer1) {
            request(url).get('/beers/' + beer1._id).end(function (err, res) {
                res.text.should.containEql(beer1.name);
                res.text.should.containEql(beer1.type);
                beerModel.findByIdAndRemove(beer1._id, function (err, result){});
                done();
            });
        });
    });

});



/*
*-------------------------------Test Pubs----------------------------
*/
describe('Test pubs', function () {


    it('Creazione di un pub', function (done) {
        request(url).post('/pubs').send({name: 'test_pub', location: 'via test'}).end(function (err, res) {
            res.header.should.have.property('location', '/pubs/create?message=pub%20inserted%20correctly');
            pubModel.find({name: 'test_pub'}, function (err, pub) {
                menuModel.remove({id: pub.menu}, function () {
                    pubModel.remove({name : 'test_pub'}, function (err) {
                        done();
                    });

                });
            });
        });
    });


    it('Rimozione di un pub, unit', function (done) {
        pubModel.create({name: 'pub_to_remove', location: 'via delete'}, function (err, pub) {
            request(url).delete('/pubs/' + pub._id).end(function(err, res) {
                res.should.have.property('status', 302);
                pubModel.findById(pub._id, function (err, removed_pub) {
                    should(removed_pub).not.be.ok();
                    res.header.should.have.property('location', '/pubs');
                    done();
                });
            });
        });
    });


    it('Ricezione di un pub', function (done) {
        pubModel.create({name: 'pub_to_return', location: 'via return'}, function (err, pub) {
            request(url).get('/pubs/' + pub._id).end(function (err, res) {
                res.text.should.containEql(pub.name);
                res.text.should.containEql(pub.location);
                pubModel.findByIdAndRemove(pub._id, function (){
                    done();
                });
            });
        });
    });


    it('Ricezione di tutti i pub', function (done) {
        pubModel.create({name: 'first_pub_to_return', location: 'via first return'}, function (err, pub1) {
            pubModel.create({name: 'second_pub_to_return', location: 'via second return'}, function (err, pub2) {
                request(url).get('/pubs').end(function (err, res) {
                    res.text.should.containEql(pub1.name);
                    res.text.should.containEql(pub1.location);
                    res.text.should.containEql(pub2.name);
                    res.text.should.containEql(pub2.location);
                    pubModel.findByIdAndRemove(pub1._id, function (err, result){});
                    pubModel.findByIdAndRemove(pub2._id, function (err, result){});
                    done();
                });
            });
        });
    });


    it('Rimozione di una birra dal menu di un pub', function (done) {
        beerModel.create(testBeer, function(err, beer1) {
            menuModel.create({beers:[]}, function(err, menu) {
                entryMenuModel.create({beer: beer1._id, price: 2, menu: menu._id}, function(err, entry) {
                    menu.beers.push(entry._id);
                    menu.save(function(err, upMenu){
                        pubModel.create({name: 'pub_test', location: 'Roma', menu: menu._id}, function(err, pub){
                            request(url).delete('/pubs/'+ pub._id + '/beers/' + beer1._id).end(function (err, res) {
                                setTimeout(function () {
                                    res.should.have.property('status', 302);
                                    entryMenuModel.findById(entry._id, function(err, removed_entry) {
                                        should(removed_entry).not.be.ok();
                                        res.header.should.have.property('location', '/pubs/'+ pub._id + '/beers');
                                        menuModel.findById(menu._id, function(err, menu) {
                                            should(newMenu).be.ok();
                                            menu.beers.should.not.containEql(entry._id);
                                        });
                                        beerModel.findByIdAndRemove(beer1._id, function (err, result){});
                                        entryMenuModel.findByIdAndRemove(entry._id, function(err, result){});
                                        menuModel.findByIdAndRemove(menu._id, function(err, result){});
                                        pubModel.findByIdAndRemove(pub._id, function(err, result){});
                                        done();
                                    });
                                }, 50);
                            });
                        });
                    });
                });
            });
        });
    });

    it('inserimento bulk di birre nel menu', function (done) {
        beerModel.create(testBeer, function(err, beer1) {
            beerModel.create(testBeer2, function(err, beer2) {
                menuModel.create({beers:[]}, function(err, menu) {
                    pubModel.create({name:'pub_test', location:'Roma', menu:menu._id}, function(err, pub) {
                        var body = {};
                        body['submit'] = '';
                        body['beers'] = [beer1._id, beer2._id];
                        body[beer1._id] = 1;
                        body[beer2._id] = 2;
                        request(url).post('/pubs/'+ pub._id +'/beers/insert').send(body).end(function(err, res) {
                            res.header.should.have.property('location', '/pubs/'+pub._id+'/beers/insert?message=beers%20inserted');
                            pubModel.findByIdAndRemove(pub._id, function(err, result) {
                                menuModel.findById(menu._id, function(err, newMenu) {
                                    entryMenuModel.findByIdAndRemove(newMenu.beers[0], function(err, result) {
                                        entryMenuModel.findByIdAndRemove(newMenu.beers[1], function(err, result) {
                                            menuModel.findByIdAndRemove(menu._id, function(err, result) {
                                                beerModel.findByIdAndRemove(beer1._id, function(err, result) {
                                                    beerModel.findByIdAndRemove(beer2._id, function(err, result) {
                                                        done();
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });

    it('Modifica di una birra del menu', function (done) {
        beerModel.create(testBeer, function(err, beer1) {
            menuModel.create({beers:[]}, function(err, menu) {
                entryMenuModel.create({beer: beer1._id, price: 2, menu: menu._id}, function(err, entry) {
                    menu.beers.push(entry._id);
                    menu.save(function(err, upMenu){
                        pubModel.create({name: 'pub_test', location: 'Roma', menu: menu._id}, function(err, pub){
                            request(url).put('/pubs/'+ pub._id + '/beers/' + beer1._id).send({submit:'', price:20}).end(function (err, res) {
                                setTimeout(function () {
                                    res.should.have.property('status', 302);
                                    entryMenuModel.findById(entry._id, function(err, newEntry) {
                                        assert.equal(newEntry.price, 20);
                                        res.header.should.have.property('location', '/pubs/'+ pub._id + '/beers');
                                        beerModel.findByIdAndRemove(beer1._id, function (err, result){});
                                        entryMenuModel.findByIdAndRemove(entry._id, function(err, result){});
                                        menuModel.findByIdAndRemove(menu._id, function(err, result){});
                                        pubModel.findByIdAndRemove(pub._id, function(err, result){});
                                        done();
                                    });
                                }, 50);
                            });
                        });
                    });
                });
            });
        });
    });

    it('Modifica di un pub', function (done) {
        pubModel.create({name: 'oldName', location: 'oldLoc'}, function (err, pub) {
            var upPub = {
                name: 'newName',
                location: 'newLoc'
            };

            request(url).put('/pubs/' + pub._id).send(upPub).end(function (err, res) {
                pubModel.findById(pub._id, function (err, pub) {
                    should(pub).be.ok();
                    assert.equal(pub.name, 'newName');
                    assert.equal(pub.location, 'newLoc');
                    pubModel.findByIdAndRemove(pub._id, function (err, result) {
                        done();
                    });
                });
            });
        });
    });
});
