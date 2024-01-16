const fs = require("fs").promises;

class ProductManager {

    static ultId = 0;

    constructor() {
        this.products = [];
        this.path = "./productos.json";
    }

    async addProduct({ title, description, price, img, code, stock }) {

        //Validamos que se agregaron todos los campos: 
        if (!title || !description || !price || !img || !code || !stock) {
            console.log("Todos los campos son obligatorios");
            return;
        }

        //Validamos que el código sea único: 
        if (this.products.some(item => item.code === code)) {
            console.log("El código debe ser único");
            return;
        }

        //Creamos un nuevo objeto: 
        const newProduct = {
            id: ++ProductManager.ultId,
            title,
            description,
            price,
            img,
            code,
            stock
        }

        //Lo agrego al array: 
        this.products.push(newProduct);

        //Acá despues de pushear el nuevo producto, tienen que guardar el array en el archivo. 
        await this.guardarArchivo(this.products);
    }

    async getProducts() {
        //Este tiene que leer el archivo y retornarlo en formato array. 
        await this.leerArchivo()
    }

    async getProductById(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const buscado = arrayProductos.find(item => item.id === id);
            if (!buscado) {
                console.error("Not Found");
            } else {
                console.log(buscado);
            }
        } catch (error) {
            console.log(error);
        }
    }

    async updateProduct(id, updatedFields) {
        try {
            const arrayProductos = await this.leerArchivo();
            const productIndex = arrayProductos.findIndex(item => item.id === id);

            if (productIndex === -1) {
                console.error("Not Found");
                return;
            }

            arrayProductos[productIndex].title = updatedFields.title || arrayProductos[productIndex].title;
            arrayProductos[productIndex].description = updatedFields.description || arrayProductos[productIndex].description;
            arrayProductos[productIndex].price = updatedFields.price || arrayProductos[productIndex].price;
            arrayProductos[productIndex].img = updatedFields.img || arrayProductos[productIndex].img;
            arrayProductos[productIndex].code = updatedFields.code || arrayProductos[productIndex].code;
            arrayProductos[productIndex].stock = updatedFields.stock || arrayProductos[productIndex].stock;

            await this.guardarArchivo(arrayProductos);

            console.log(`Producto con ID ${id} actualizado correctamente`);
        } catch (error) {
            console.error(error);
        }
    }

    async deleteProduct(id) {
        try {
            const arrayProductos = await this.leerArchivo();
            const indiceEliminar = arrayProductos.findIndex(item => item.id === id);

            if (indiceEliminar === -1) {
                console.error("Not Found");
                return;
            }

            // Eliminar el elemento en el índice encontrado
            arrayProductos.splice(indiceEliminar, 1);

            // Guardar la lista actualizada de productos en el archivo
            await this.guardarArchivo(arrayProductos);

            console.log(`Producto con ID ${id} eliminado correctamente`);
        } catch (error) {
            console.log(error);
        }
    }

    //Métodos desafio 2: 

    async leerArchivo() {
        try {
            const respuesta = await fs.readFile(this.path, "utf-8");
            const arrayProductos = JSON.parse(respuesta);
            return arrayProductos;
        } catch (error) {
            console.log("error al leer el archivo", error);
        }
    }

    async guardarArchivo(arrayProductos) {
        try {
            await fs.writeFile(this.path, JSON.stringify(arrayProductos, null, 2));
        } catch (error) {
            console.log("Error al guardar el archivo", error);
        }
    }
}


//TESTING:

// 1) Se creará una instancia de la clase “ProductManager”
const manager = new ProductManager();

// 2) Se llamará “getProducts” recién creada la instancia, debe devolver un arreglo vacío []
console.log(manager.getProducts());

// 3) Se llamará al método “addProduct” con los campos
manager.addProduct({
    title: "Producto prueba",
    description: "esto es un producto prueba",
    price: 200,
    img: "sin imagen",
    code: "abc1",
    stock: 25
});

manager.addProduct({
    title: "Producto prueba",
    description: "esto es un producto prueba",
    price: 200,
    img: "sin imagen",
    code: "abc2",
    stock: 25
});

manager.addProduct({
    title: "Producto prueba",
    description: "esto es un producto prueba",
    price: 200,
    img: "sin imagen",
    code: "abc3",
    stock: 25
});

// 4) El objeto debe agregarse satisfactoriamente con un id generado automáticamente SIN REPETIRSE
// 5) Se llamará el método “getProducts” nuevamente, esta vez debe aparecer el producto recién agregado
console.log(manager.getProducts());

// 6) Se llamará al método “getProductById” y se corroborará que devuelva el producto con el id especificado, en caso de no existir, debe arrojar un error.
manager.getProductById(1);

// 7) Se llamará al método “updateProduct” y se intentará cambiar un campo de algún producto, se evaluará que no se elimine el id y que sí se haya hecho la actualización.
manager.updateProduct(1, { title: 'Titulo Actualizado' });

// 8) Se llamará al método “deleteProduct”, se evaluará que realmente se elimine el producto o que arroje un error en caso de no existir.
manager.deleteProduct(1);
manager.deleteProduct(2);
