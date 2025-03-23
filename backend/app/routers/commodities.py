from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.commodity import Commodity as CommodityModel, Price
from datetime import datetime

router = APIRouter()

class Commodity(BaseModel):
    id: str
    name: str
    category: str
    current_price: float
    unit: str
    last_updated: str

@router.get("/", response_model=List[Commodity])
async def get_commodities(
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    try:
        # Query from database
        query = db.query(CommodityModel)
        if category:
            query = query.filter(CommodityModel.category.ilike(f"%{category}%"))
        
        commodities = query.all()
        
        if not commodities:
            return []
            
        # Format response
        result = []
        for commodity in commodities:
            # Get the latest price
            latest_price = db.query(Price)\
                .filter(Price.commodity_id == commodity.id)\
                .order_by(Price.timestamp.desc())\
                .first()
                
            price_value = 0.0
            last_updated = datetime.now().strftime("%Y-%m-%d")
            
            if latest_price:
                price_value = latest_price.price
                last_updated = latest_price.timestamp.strftime("%Y-%m-%d")
                
            result.append({
                "id": commodity.id,
                "name": commodity.name,
                "category": commodity.category,
                "current_price": price_value,
                "unit": commodity.unit,
                "last_updated": last_updated
            })
            
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{commodity_id}", response_model=Commodity)
async def get_commodity(
    commodity_id: str,
    db: Session = Depends(get_db)
):
    try:
        # Query from database (try direct match first)
        commodity = db.query(CommodityModel)\
            .filter(CommodityModel.id == commodity_id)\
            .first()
            
        # If not found, try matching by name
        if not commodity:
            commodity = db.query(CommodityModel)\
                .filter(CommodityModel.name.ilike(f"%{commodity_id}%"))\
                .first()
        
        if not commodity:
            raise HTTPException(status_code=404, detail="Commodity not found")
            
        # Get the latest price
        latest_price = db.query(Price)\
            .filter(Price.commodity_id == commodity.id)\
            .order_by(Price.timestamp.desc())\
            .first()
            
        price_value = 0.0
        last_updated = datetime.now().strftime("%Y-%m-%d")
        
        if latest_price:
            price_value = latest_price.price
            last_updated = latest_price.timestamp.strftime("%Y-%m-%d")
            
        return {
            "id": commodity.id,
            "name": commodity.name,
            "category": commodity.category,
            "current_price": price_value,
            "unit": commodity.unit,
            "last_updated": last_updated
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 