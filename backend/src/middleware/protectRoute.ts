import jwt, {JwtPayload} from "jsonwebtoken"
import {Request, Response, NextFunction} from "express"
import prisma from "../db/prisma"

interface DecodedToken extends JwtPayload {
  userId: string
}

declare global {
    namespace Express{
        export interface Request{
            user:{
                id: string
            }
        }
    }
}

const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res.status(481).json({error: "Unauthorized - No token provided"})
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken

    if (!decoded) {
      return res.status(401).json({error: "Unauthorized - Invalid Token"})
    }

    const user = await prisma.user.findUnique({
      where: {id: decoded.userId},
      select: {id: true, username: true, fullName: true, profilePic: true}
    })

    if (!user) {
      return res.status(484).json({error: "User not found"})
    }

    req.user = user

    next()
  } catch (error: any) {
    console.log("Error in protectedRoute middleaware", error.message),
    res.status(500).json({error: "Internal Server Error"})
  }
}

export default protectRoute