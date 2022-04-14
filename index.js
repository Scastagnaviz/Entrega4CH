const { response } = require('express');
const express = require ('express');

const app = express();
const {Router} = express;
const router= Router();

const  PORT = 8080;

app.use('/static',express.static((__dirname +'public')));


app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use('/api/productos', router);
const fs = require('fs');  

class contenedor{
    constructor(archivo){
        this.cont = 0 ;
        this.arr= [];
        this.archivo = archivo;
    }
    save(obj){
        try{
       this.cont ++ ;
       obj.id = this.cont;
       this.arr.push(obj);
       fs.writeFileSync(this.archivo,JSON.stringify(this.arr))
        }
         catch{
             console.log('error al leer el archivo')
         }
            
    }
    getAll(){
        return this.arr;
    }
    getByiD(id){
        try {
         return  this.arr.find(producto => id == producto.id);
        } catch (error) {
            console.log(error);
            return null;
        }
}
deleteById(id){
    let i  =this.arr.indexOf(this.getByiD(id));
     this.arr.splice(i,1);
       fs.writeFileSync(this.archivo,JSON.stringify(this.arr))
       }
       
       editById(id,obj){
           
        try {
        obj.id=id;
       let  indice= this.arr.findIndex(obj=>obj.id==id);
          this.arr[indice]=obj;
           fs.writeFileSync(this.archivo,JSON.stringify(this.arr))
           } catch (error) {
               console.log(error);
               return null;
           }   
    }
}


let conten = new contenedor('./productos.json');
conten.save({"nombre": 'heladera' ,"precio": 123 ,"url": 'url1'});
conten.save({"nombre": 'Microondas' ,"precio": 443 ,"url": 'url2'});
conten.save({"nombre": 'Cafetera' ,"precio": 1616 ,"url": 'url3'});
conten.save({"nombre": 'Arrocera' ,"precio": 2204 ,"url": 'url4'});

 const server  = app.listen(PORT, () =>  {
console.log( `Servidor Http escuchando  en el puerto ${PORT}`);
 }) ;

 server.on("error", error => console.log(`error en el servidor ${error}`));
 

 router.get('/',(req,res)=>{
    productos= conten.getAll();
    res.json({
        result: 'Productos:', 
        Productos:productos})

 });

 router.get('/:id',(req,res)=> {
    let id= req.params.id;
    if (conten.getByiD(id)==null) {
        res.json({
            error : 'Producto no encontrado'})
          
    } else {
        let found = conten.getByiD(id);
        res.json({
            result: 'Este es el producto', 
            Producto : found})
    } 
  
});
router.post('/',(req,res)=>{
    let obj= req.body;
    conten.save(obj);

    res.json({ 
        result : 'Producto guardado',
        body:req.body,
});
});

router.put('/:id',(req,res)=>{
    let id= req.params.id; 
   conten.editById(id,req.body)
    res.json({
        body:req.body,
        result:'Edit exitoso',
        id : req.params.id
    })
});
router.delete('/:id',(req,res)=>{
    let id= req.params.id; 
  conten.deleteById(id);
   res.json({
       result:'Producto eliminado',
       id : req.params.id,
       })
   });

app.get('/form', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});
app.post('/post',(req,res)=>{
    obj= req.body;
    conten.save(obj);
    console.log(req.body);
    //conten.save(req.body);
  
    res.json({ 
        result : 'Producto guardado',
        body:req.body,
});
});
