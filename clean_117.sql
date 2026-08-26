DELETE FROM equipment 
WHERE category_id = '88409ce8-a84c-4d9d-b857-e4b09acaf626'
  AND name IN ('Alternator', 'Diesel Generator')
  AND id NOT IN (SELECT DISTINCT equipment_id FROM guides WHERE equipment_id IS NOT NULL);