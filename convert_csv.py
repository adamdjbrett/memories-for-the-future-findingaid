#!/usr/bin/env python3
import csv
import os
import re
from pathlib import Path
from datetime import datetime

# Parse date formats
def parse_date(date_str):
    """Parse various date formats"""
    if not date_str or date_str.strip() == '':
        return None
    
    date_str = date_str.strip()
    
    # Try common formats
    formats = [
        '%m/%d/%Y',
        '%m/%d/%y',
        '%Y-%m-%d',
        '%Y',
        '%B %d, %Y',
        '%d/%m/%Y',
    ]
    
    for fmt in formats:
        try:
            dt = datetime.strptime(date_str, fmt)
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            continue
    
    # If it looks like a year only
    if len(date_str) == 4 and date_str.isdigit():
        return f"{date_str}-01-01"
    
    return None

# Generate filename from title
def generate_filename(title):
    """Generate filename: lowercase, max 20 chars, hyphens, no special chars"""
    # Convert to lowercase
    name = title.lower().strip()
    # Remove special characters, keep only alphanumeric and spaces
    name = re.sub(r'[^a-z0-9\s]', '', name)
    # Replace multiple spaces with single space
    name = re.sub(r'\s+', ' ', name)
    # Replace spaces with hyphens
    name = name.replace(' ', '-')
    # Remove trailing hyphens
    name = name.strip('-')
    # Truncate to 20 characters
    name = name[:20]
    # Remove trailing hyphens after truncation
    name = name.rstrip('-')
    
    return name

# Create markdown frontmatter
def create_frontmatter(row):
    """Create YAML frontmatter from CSV row"""
    title = row.get('title', '').strip()
    author = row.get('author', '').strip()
    date = parse_date(row.get('date', ''))
    description = row.get('description', '').strip()
    tags_str = row.get('tags', '').strip()
    urls_str = row.get('urls', '').strip()
    
    frontmatter = "---\n"
    
    # Title
    if title:
        frontmatter += f'title: "{title}"\n'
    
    # Date
    if date:
        frontmatter += f'date: {date}\n'
    else:
        frontmatter += f'date: {datetime.now().strftime("%Y-%m-%d")}\n'
    
    # Description
    if description:
        frontmatter += f'description: "{description}"\n'
    
    # Excerpt
    if description:
        frontmatter += "excerpt:\n"
        frontmatter += f'  - text: "{description}"\n'
    
    # Author
    if author:
        frontmatter += "author:\n"
        if urls_str:
            frontmatter += f' - name: "{author}"\n'
            frontmatter += f'   url: "{urls_str}"\n'
        else:
            frontmatter += f' - name: "{author}"\n'
    elif urls_str:
        # If we have URL but no author, still include it
        frontmatter += f'url: "{urls_str}"\n'
    
    # Tags
    tags_list = [tag.strip() for tag in tags_str.split(',') if tag.strip()]
    if tags_list:
        frontmatter += "tags:\n"
        for tag in tags_list:
            frontmatter += f' - {tag}\n'
    
    # Canonical URL
    if urls_str:
        frontmatter += f'canonical_url: {urls_str}\n'
    
    frontmatter += "---\n"
    
    return frontmatter

# Main conversion
def convert_csv_to_markdown():
    csv_path = Path('/Users/abrett76/github/memories-for-the-future-findingaid/_data/memories.csv')
    content_dir = Path('/Users/abrett76/github/memories-for-the-future-findingaid/content')
    
    # Directory mapping
    collection_map = {
        'UNPFII': 'unpfii',
        'UNDRIP': 'undrip',
        'EMRIP': 'emrip',
    }
    
    created_files = []
    duplicates = {}
    
    with open(csv_path, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        
        for row_num, row in enumerate(reader, start=2):  # Start at 2 because row 1 is header
            collection = row.get('collection', '').strip()
            title = row.get('title', '').strip()
            
            if not title:
                print(f"Row {row_num}: Skipping - no title")
                continue
            
            # Determine target directory
            if collection in collection_map:
                target_dir = content_dir / collection_map[collection]
            else:
                target_dir = content_dir / 'general'
            
            # Generate filename
            filename_base = generate_filename(title)
            filename = f"{filename_base}.md"
            
            # Handle duplicates
            if filename_base in duplicates:
                duplicates[filename_base] += 1
                filename = f"{filename_base}-{duplicates[filename_base]}.md"
            else:
                duplicates[filename_base] = 0
            
            filepath = target_dir / filename
            
            # Create frontmatter
            frontmatter = create_frontmatter(row)
            
            # Write file
            try:
                with open(filepath, 'w', encoding='utf-8') as mf:
                    mf.write(frontmatter)
                
                created_files.append({
                    'file': str(filepath.relative_to(content_dir.parent.parent)),
                    'collection': collection,
                    'title': title,
                    'filename': filename
                })
                print(f"✓ Created: {target_dir.name}/{filename}")
            except Exception as e:
                print(f"✗ Error creating {filepath}: {e}")
    
    # Summary
    print(f"\n{'='*60}")
    print(f"Conversion complete!")
    print(f"Total files created: {len(created_files)}")
    print(f"{'='*60}\n")
    
    # Summary by collection
    collections = {}
    for item in created_files:
        col = item['collection'] or 'uncategorized'
        if col not in collections:
            collections[col] = []
        collections[col].append(item)
    
    for col in sorted(collections.keys()):
        print(f"{col}: {len(collections[col])} files")
        for item in collections[col]:
            print(f"  → {item['filename']}")

if __name__ == '__main__':
    convert_csv_to_markdown()
