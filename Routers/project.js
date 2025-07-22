import { Router } from "express";

//import http  from "../controllers/.js"

const router = Router();

router.get('api/projects')

router.get('api/projects/:id')

router.post('api/projects')

router.post('api/projects/:id/members')

router.put('api/projects/:id')

router.put('api/projects/:id/status')

router.delete('api/projects/:id')

router.delete('api/projects/:id/members/:userld')
