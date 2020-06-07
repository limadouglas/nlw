import {Request, Response} from 'express';
import knex from '../database/connection';

class PointsController{

  async index(request: Request, response: Response) {
    const { city, uf, items} = request.query;

    const parsedItems = String(items).split(',').map(item=>Number(item.trim()));
    
    const points = await knex('points')
      .join('points_items', 'points.id', '=', 'points_items.point_id')
      .whereIn('points_items.item_id', parsedItems)
      .where('city', String(city))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    const serializedPoint = points.map(point => {
      return { 
        ...point,
        image_url: `http://192.168.15.57:3333/uploads/${point.image}`
      }
    });

    return response.json(serializedPoint);
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;

    const point = await knex('points').where('id', id).first();

    if(!point){
      return response.status(404).json({message: 'Point not Found.'});
    }

    const serializedPoint = {
      ...point,
      image_url: `http://192.168.15.57:3333/uploads/${point.image}`
    }

    const items = await knex('items')
      .join('points_items', 'items.id', '=', 'points_items.item_id')
      .where('points_items.point_id', id)
      .select('items.title');

    return response.json({point: serializedPoint, items});
  }

  async create(request: Request, response: Response) {
    const {
      image = request.file.filename,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items
    } = request.body;
  
    const tsx = await knex.transaction();
  
    const insertedIds = await tsx('points').insert({
      image,
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    })
    const point_id = insertedIds[0];
  
    const pointItems = items
      .split(',')
      .map((item:string)=>Number(item.trim()))
      .map((item_id:number) => ({item_id, point_id}))
  
    await tsx('points_items').insert(pointItems);

    await tsx.commit();
  
    return response.json({success: true});
  }
}

export default PointsController;