const request = require('supertest');
var app = require('./server');
const chai = require('chai')
const expect = chai.expect;


describe('Testing', function() {
    // eslint-disable-next-line max-len

    it('no access due to no token supplied', function(done) {
        setTimeout(done, 400);
        request(app , function(error, response, body) {
            let rsp = {"success":false,"message":"Auth token is not supplied"};
            console.log(JSON.parse(body));
            expect(JSON.parse(body).success).to.equal(false);
            expect(JSON.parse(body).message).to.equal("Auth token is not supplied");
            done();
        });
    });




    it('Should give a token back', function(done) {
        setTimeout(done,2000);
        request(app)
            .post('/api/token')
            .send({email:'foo@bar.com'})
            .set('Accept', 'application/json')
            .end((err,res)=>{
                //console.log(res.body);
                expect(res.body.message).to.eq('Authentication successful!');
                //expect(res.status.to.equal(200));
                done();

            })


    });


    it('Should justify a text', function(done) {
        setTimeout(done,2000);
        request(app)
            .post('/api/justify')
            .type('form')
            .send('Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte, mes yeux se fermaient si vite que je \nn’avais pas le temps de me dire: «Je m’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le \nsommeil m’éveillait; je voulais poser le volume que je croyais avoir dans les mains et souffler ma lumière; je n’avais pas\ncessé en dormant de faire des réflexions sur ce que je venais de lire, mais ces réflexions avaient pris un tour un peu \nparticulier; il me semblait que j’étais moi-même ce dont parlait l’ouvrage: une église, un quatuor, la rivalité de François \nIer et de Charles-Quint.')
            .set('Authorization', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZvb0BiYXIuY29tIiwiaWF0IjoxNTczNDE4NTYzLCJleHAiOjE1NzM1MDQ5NjN9.y40L9IBVzkMwS3UQmVPZcF26xPoBOX6WRWTl_fekz-E')
            .set('Content-Type','text/plain')
            .end((err,res)=>{
                console.log('-----------------');
                //setTimeout(()=>{console.log(res.text);},10000)
                console.log(err);
                expect(res.text).to.equal('Longtemps, je me suis couché de bonne heure. Parfois, à peine ma bougie éteinte,\nmes yeux se fermaient si vite que je  n’avais pas  le  temps  de  me  dire:  «Je\nm’endors.» Et, une demi-heure après, la pensée qu’il était temps de chercher le \nsommeil m’éveillait; je voulais poser le volume que je croyais  avoir  dans  les\nmains et souffler ma lumière; je n’avais pas  cessé  en  dormant  de  faire  des\nréflexions sur ce que je venais de lire, mais ces  réflexions  avaient  pris  un\ntour un peu  particulier; il me semblait que j’étais moi-même  ce  dont  parlait\nl’ouvrage: une  église,  un  quatuor,  la  rivalité  de  François    Ier  et  de\nCharles-Quint.\n');
                done();

            })


    });




});
