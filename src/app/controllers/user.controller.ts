import express, { Request, Response } from "express"
import { User } from "../models/user.model"

export const usersRoutes = express.Router()

usersRoutes.post('/create-user', async (req: Request, res: Response) => {

    const body = req.body

    const user = await User.create(body)

    res.status(201).json({
        success: true,
        message: "User created successfuly",
        user
    })
})
usersRoutes.get('/', async (req: Request, res: Response) => {
    const users = await User.find()

    res.status(201).json({
        success: true,
        message: "All Users retreived successfuly",
        users
    })
})
usersRoutes.get('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId
    const user = await User.findById(userId)

    res.status(201).json({
        success: true,
        message: "User retrived successfuly",
        user
    })
})
usersRoutes.delete('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId
    const user = await User.findByIdAndDelete(userId)


    res.status(201).json({
        success: true,
        message: "User Deleted successfuly",
        user
    })
})
usersRoutes.patch('/:userId', async (req: Request, res: Response) => {
    const userId = req.params.userId
    const updatedBody = req.body;
    const user = await User.findByIdAndUpdate(userId, updatedBody, { new: true, })

    res.status(201).json({
        success: true,
        message: "User updated successfuly",
        user
    })
})