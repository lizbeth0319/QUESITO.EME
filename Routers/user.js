import { Router } from "express";
//import http  from "../controllers/.js"

const router = Router();

router.get('api/users')

router.get('api/users/profile')

router.put('api/users/profile')

router.put('api/users/:id/role')

router.post('api/users/create')

router.delete('api/users/:id')
