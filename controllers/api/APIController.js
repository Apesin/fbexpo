var Request = require("request");      
const controller = 'Products'; 
const module_name = 'Products'; 
const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
const ProductsService = require("../../services/products.services");
const productsService = new ProductsService();
const AccountService = require("../../services/account.services");
const accountService = new AccountService();


async function getProductsList(req, res) {
    let result = await productsService.getProducts();
    if (result.error) {
      return res.status(500).json(result);
    } else {
      return res.status(200).json(result);
    }
  }     
exports.getProductsList = getProductsList;
 