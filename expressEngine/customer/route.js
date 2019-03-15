// importing packages
import {
    Router
} from "express";

import { CustomerController } from "./controller/index";


// import controller
import {
    CustomerParser
} from './parser';

const router = Router();

router
    .post('/',
        CustomerParser.run(CustomerController, 'create'));

export default router;