-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  department TEXT NOT NULL,
  parent_id TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  icon TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Equipment Table
CREATE TABLE IF NOT EXISTS equipment (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
);

-- Guides Table
CREATE TABLE IF NOT EXISTS guides (
  id TEXT PRIMARY KEY,
  equipment_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author_email TEXT,
  author_phone TEXT,
  symptom TEXT,
  safety_ppe TEXT,
  tools_required TEXT,
  introduction TEXT,
  status TEXT DEFAULT 'pending',
  is_approved INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE
);

-- Guide Steps Table
CREATE TABLE IF NOT EXISTS guide_steps (
  id TEXT PRIMARY KEY,
  guide_id TEXT NOT NULL,
  step_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  instruction TEXT NOT NULL,
  warning TEXT,
  images TEXT,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE
);

-- Guide Images Table
CREATE TABLE IF NOT EXISTS guide_images (
  id TEXT PRIMARY KEY,
  guide_id TEXT NOT NULL,
  caption TEXT,
  url TEXT NOT NULL,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE
);

-- Bookmarks Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id TEXT PRIMARY KEY,
  guide_id TEXT NOT NULL,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (guide_id) REFERENCES guides(id) ON DELETE CASCADE
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_equipment_category_id ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_guides_equipment_id ON guides(equipment_id);
CREATE INDEX IF NOT EXISTS idx_guide_steps_guide_id ON guide_steps(guide_id);
CREATE INDEX IF NOT EXISTS idx_guide_images_guide_id ON guide_images(guide_id);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_guide_id ON bookmarks(guide_id);