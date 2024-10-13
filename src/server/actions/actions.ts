/* eslint-disable @typescript-eslint/no-explicit-any */

'use server'
import { volModel, Volunteer } from '@/server/models/Vol'
import { isConnected, ConnectStat } from '@/utils/mymg'
import { FilterQuery,  } from 'mongoose'


export async function getConnection(): Promise<ConnectStat> {
    return isConnected
}


export async function findVol(filter?: FilterQuery<any>): Promise<Volunteer[]> {
    if (isConnected) {
        if (filter)
            return JSON.parse(JSON.stringify(await volModel.find(filter)))
        return JSON.parse(JSON.stringify(await volModel.find()))
    }
    return []
}


export async function addVol(toAdd: FilterQuery<any>): Promise<string> {
    try {
        await volModel.create(toAdd)
        return "Added vol successfully!"
    } catch (e: any) {
        return e.message
    }
}


export async function delVol(toDel?: FilterQuery<any>): Promise<string> {
    try {
        if (toDel)
            await volModel.deleteOne(toDel)
        else
            await volModel.deleteMany()
        return "Deleted vol successfully!"
    } catch (e: any) {
        return e.message
    }
}