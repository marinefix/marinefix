UPDATE guides 
SET equipment_id = 'eq-pgd-msb' 
WHERE id = '5952c265-c9cd-42b9-82db-9ce481f623ee';

DELETE FROM equipment 
WHERE id = '728f94b4-9025-4174-b383-02a20f27034f'
   OR (name = 'Emergency Switchboard (ESB)' AND id != 'eq-pgd-esb');