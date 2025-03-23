import pandas as pd
from datetime import datetime
from pathlib import Path
from sqlalchemy.orm import Session
from .models.commodity import Commodity, Price
import logging
import re

logger = logging.getLogger(__name__)

def load_csv_data(db: Session):
    """Load data from CSV files into the database"""
    try:
        # Get the project root directory
        project_root = Path(__file__).parent.parent
        csv_dir = project_root / 'csv_files'
        
        if not csv_dir.exists():
            logger.warning(f"CSV directory not found: {csv_dir}")
            return
            
        # Define commodity mappings
        commodity_mappings = {
            'wheat-001': {
                'name': 'Wheat',
                'description': 'Premium quality wheat grain',
                'unit': 'INR per Metric Ton',
                'category': 'Cereals',
                'file': 'wheat-60.csv'
            },
            'rice-001': {
                'name': 'Rice',
                'description': 'Premium quality rice',
                'unit': 'INR per Metric Ton',
                'category': 'Cereals',
                'file': 'rice-60.csv'
            },
            'corn-001': {
                'name': 'Corn',
                'description': 'Premium quality corn',
                'unit': 'INR per Metric Ton',
                'category': 'Cereals',
                'file': 'corn-60.csv'
            },
            'bananas-001': {
                'name': 'Bananas',
                'description': 'Fresh bananas',
                'unit': 'INR per Metric Ton',
                'category': 'Fruits',
                'file': 'bananas-60.csv'
            },
            'tea-001': {
                'name': 'Tea',
                'description': 'Premium quality tea',
                'unit': 'INR per Metric Ton',
                'category': 'Beverages',
                'file': 'tea-60.csv'
            }
        }

        # First, clear existing data
        db.query(Price).delete()
        db.query(Commodity).delete()
        db.commit()
        logger.info("Cleared existing data")

        # Create commodities
        for commodity_id, info in commodity_mappings.items():
            commodity = Commodity(
                id=commodity_id,
                name=info['name'],
                description=info['description'],
                unit=info['unit'],
                category=info['category']
            )
            db.add(commodity)
            logger.info(f"Added commodity: {info['name']}")
        db.commit()

        # Load price data for each commodity
        for commodity_id, info in commodity_mappings.items():
            csv_path = csv_dir / info['file']
            if not csv_path.exists():
                logger.warning(f"CSV file not found: {csv_path}")
                continue
            
            try:
                # Read CSV file - these files have a special format with headers in the first two rows
                with open(csv_path, 'r') as file:
                    lines = file.readlines()
                
                # Skip the title and unit rows
                for line in lines[2:]:  # Skip the first two rows
                    if not line.strip():
                        continue
                    
                    parts = line.strip().split(',')
                    if len(parts) >= 2:
                        month_str = parts[0].strip().strip('"')
                        price_str = parts[1].strip().strip('"')
                        
                        # Extract price value using regex to handle the formatting
                        price_match = re.search(r'(\d+(?:,\d+)*(?:\.\d+)?)', price_str)
                        if price_match:
                            price_value = float(price_match.group(1).replace(',', ''))
                            
                            # Convert month string to date
                            try:
                                date = datetime.strptime(month_str, '%b %Y')
                                
                                # Create a random volume for demonstration
                                import random
                                volume = random.randint(100, 1000)
                                
                                # Create price entry
                                price = Price(
                                    commodity_id=commodity_id,
                                    price=price_value,
                                    timestamp=date,
                                    source="csv_import",
                                    volume=volume,
                                    currency="INR"
                                )
                                db.add(price)
                                logger.info(f"Added price for {info['name']}: {date.strftime('%Y-%m-%d')} - {price_value}")
                            except ValueError as e:
                                logger.error(f"Error parsing date '{month_str}': {e}")
                
                db.commit()
                logger.info(f"Loaded price data for {info['name']}")
                
            except Exception as file_error:
                logger.error(f"Error processing file {info['file']}: {file_error}")
                db.rollback()
                continue

        logger.info("Successfully loaded all CSV data")
        
    except Exception as e:
        logger.error(f"Error in load_csv_data: {str(e)}")
        db.rollback()
        raise 