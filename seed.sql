-- 1. CLEANUP EXISTING DATA
DELETE FROM bookmarks;
DELETE FROM guide_images;
DELETE FROM guide_steps;
DELETE FROM guides;
DELETE FROM equipment;
DELETE FROM categories;

-- 2. INSERT CATEGORIES (16 Departments)
INSERT INTO categories (id, name, slug, department, parent_id, order_index, icon) VALUES
('d40715d9-61d2-430e-872b-219edd5c58d2', 'Bridge & Navigation Systems', 'bridge-navigation', 'Bridge', NULL, 1, 'Compass'),
('18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Deck Machinery', 'deck-machinery', 'Deck', NULL, 2, 'Anchor'),
('b26dd740-cece-4373-8b2b-5ddc92808fcd', 'Ballast Systems', 'ballast-systems', 'Engine', NULL, 3, 'Compass'),
('7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Main Engine', 'main-engine', 'Engine', NULL, 4, 'Cog'),
('c9a81e01-1122-4433-8899-aabbccddeeff', 'Auxiliary Engine & Generator (DG)', 'auxiliary-engine-generator', 'Engine', NULL, 5, 'Cog'),
('6ac2ee2c-5e89-4785-b48b-bffebfbf3145', 'Purifiers', 'purifiers', 'Engine', NULL, 6, 'Wrench'),
('fbfd1062-6206-4a63-829f-7c8f80af6371', 'Boilers', 'boilers', 'Engine', NULL, 7, 'Flame'),
('fb045fed-0351-4e75-9d55-c6b4a54cf577', 'Compressors', 'compressors', 'Engine', NULL, 8, 'Wind'),
('571777fa-6e1b-4d62-b630-074ee029d7a0', 'Pumps', 'pumps', 'Engine', NULL, 9, 'Fan'),
('3b6be6de-3299-44c1-9498-4c8f5d7ef1d7', 'Auxiliary Systems', 'auxiliary-systems', 'Engine', NULL, 10, 'Cog'),
('88409ce8-a84c-4d9d-b857-e4b09acaf626', 'Power Generation & Distribution', 'power-generation', 'Electrical', NULL, 11, 'Zap'),
('b4220464-1880-48b7-ae81-a60a013b2d13', 'Instrumentation & Control', 'instrumentation-control', 'Electrical', NULL, 12, 'Gauge'),
('6401f03f-42d3-4f4a-a175-e67f4211ebed', 'Safety & Fire Protection', 'safety-fire-protection', 'Safety', NULL, 13, 'Shield'),
('d83e6c0e-854f-44c9-b0be-59a774b584f6', 'Accommodation & Domestic Electricals', 'accommodation-electricals', 'Electrical', NULL, 14, 'Home'),
('f36f4d66-88b8-4fdb-b7d2-7273839c5b44', 'Reefer Systems', 'reefer-systems', 'Electrical', NULL, 15, 'Snowflake'),
('e1a93b44-9988-4433-2211-ffeeddccbbaa', 'Others (General Machinery)', 'others-general-machinery', 'General', NULL, 16, 'Wrench');

-- 3. INSERT EQUIPMENT
INSERT INTO equipment (id, category_id, name, slug, description, image_url) VALUES
-- Bridge & Navigation Systems
('fd4ec9a7-dad2-47a9-937b-00fdcdc865d3', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'Others', 'others', NULL, NULL),
('7fec489a-6e6d-4223-9809-49fafef56d63', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'Speed Log', 'speed-log', NULL, NULL),
('22f3d0f6-900d-4511-b3c4-2477171e3ded', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'Anemometer', 'anemometer', NULL, NULL),
('2b005383-05c3-4ed6-8b25-3640839446cb', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'PA System', 'pa-system', NULL, NULL),
('f1644703-c17e-4958-bdb6-d49c6ae3f63a', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'Radar', 'radar', NULL, NULL),
('31931164-b45c-4bcb-ad1a-c0f7b07e9ae2', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'VDR', 'vdr', NULL, NULL),
('8d68d203-ab08-4a53-ae06-7f47b323ad3b', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'GPS', 'gps', NULL, NULL),
('1d5f6b56-cad5-4cef-ba90-ed153972efa0', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'Fog Horn & Electric Whistle', 'fog-horn-and-electric-whistle', NULL, NULL),
('04d6ea1a-0dfc-4c12-a3cc-7d45f93c051d', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'Autopilot', 'autopilot', NULL, NULL),
('5bbbc207-5eba-4b0f-9067-b2fdecc1f52c', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'ECDIS', 'ecdis', NULL, NULL),
('20a4b15e-6f77-4d83-bc05-a6b6ae01e510', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'Navigation Lights', 'navigation-lights', NULL, NULL),
('668d9932-6cd5-4fd9-9409-24d2a097af1c', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'Gyrocompass', 'gyrocompass', NULL, NULL),
('704b52cc-bf0a-44de-aa0c-5c2c84c81dfe', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'BNWAS', 'bnwas', NULL, NULL),
('6d21ef94-bb46-4f5e-8294-314759e0cebc', 'd40715d9-61d2-430e-872b-219edd5c58d2', 'Echo Sounder', 'echo-sounder', NULL, NULL),

-- Deck Machinery
('88e85b71-bd0f-4db3-a80a-c43875a55012', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Stern Thrusters', 'stern-thrusters', NULL, NULL),
('f4c833a2-c8bb-4efb-8550-d7ffa556fa38', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Lifeboat Davits', 'lifeboat-davits', NULL, NULL),
('b5ad47b4-e724-4a57-90fd-2407342abdc3', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Mooring Winches', 'mooring-winches', NULL, NULL),
('ab3591a6-4a8f-4260-8869-14cd15d043b6', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Steering Gear Systems', 'steering-gear-systems', NULL, NULL),
('a2c3c64d-9d03-4542-b1c6-dc32e83e559f', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Monorail Crane', 'monorail-crane', NULL, NULL),
('403ac700-4e5a-41f3-ae5b-9b44ff6dccd9', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Bow Thrusters', 'bow-thrusters', NULL, NULL),
('9b886e8e-b2fc-4050-be08-018b4c7f6ed6', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Others', 'others', NULL, NULL),
('4121157e-24db-40ca-92f4-15bc0ac61428', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Anchor Windlass', 'anchor-windlass', NULL, NULL),
('3e3dec15-28b0-44e5-be9c-460d7bc38e25', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Provision Cranes', 'provision-cranes', NULL, NULL),
('a3e26b17-0941-4775-9c96-857c3e536128', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Life Boat', 'life-boat', NULL, NULL),
('b7d91f28-8630-4e92-ba53-96e510ac2749', '18dcd874-24e2-4f82-af8f-47bc487a2cb0', 'Rescue Boat', 'rescue-boat', NULL, NULL),

-- Ballast Systems
('260d77b7-5221-4baa-aa17-2e805706dd1b', 'b26dd740-cece-4373-8b2b-5ddc92808fcd', 'Anti-Heeling Pump / System', 'anti-heeling-pump---system', NULL, NULL),
('cf4532a0-fd52-4400-99d8-03af5186020f', 'b26dd740-cece-4373-8b2b-5ddc92808fcd', 'Ballast Pumps', 'ballast-pumps', NULL, NULL),
('d781f7cc-d05f-4611-bbbb-e896bcafa255', 'b26dd740-cece-4373-8b2b-5ddc92808fcd', 'BWTS', 'bwts', NULL, NULL),
('d194ef78-3699-43eb-9591-f63cbdc42343', 'b26dd740-cece-4373-8b2b-5ddc92808fcd', 'Others', 'others', NULL, NULL),
('db865849-03c9-4f03-8a21-af5d544c4260', 'b26dd740-cece-4373-8b2b-5ddc92808fcd', 'Ballast Valves', 'ballast-valves', NULL, NULL),

-- Main Engine (Universal Mechanical, Electrical & Automation Scope)
('c22584c0-467a-4fc3-a350-9071aa723e17', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Turbocharger System', 'turbocharger-system', NULL, NULL),
('29977ebd-8988-4b56-ba0c-ec634ba5bd62', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Exhaust Gas System', 'exhaust-gas-system', NULL, NULL),
('4c82f2ab-5517-429b-91b1-4650ec3066ef', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Cylinder & Stuffing Box Systems', 'cylinder-and-stuffing-box-systems', NULL, NULL),
('2da31150-31cc-45aa-bdb5-282f0d6f49e7', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Scavenge Air System & Aux Blower', 'scavenge-air-system-and-aux-blower', NULL, NULL),
('21b927a2-ae98-4f4c-83d1-7506d6831e1f', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Hydraulic Power Supply (HPS)', 'hydraulic-power-supply-(hps)', NULL, NULL),
('5b5c6d36-9efc-4080-abab-f05e624260ba', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Fuel Injection System', 'fuel-injection-system', NULL, NULL),
('eq-me-ecu', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Electronic Engine Control System (ECU / MPC / WECS)', 'electronic-engine-control-system', NULL, NULL),
('eq-me-lube', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Electronic Cylinder Lubricator System (Alpha / HJ)', 'electronic-cylinder-lubricator-system', NULL, NULL),
('eq-me-maneuver', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Maneuvering & Pneumatic Control System', 'maneuvering-pneumatic-control-system', NULL, NULL),
('eq-me-safety-omd', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Safety Shutdown, Slowdown & OMD Systems', 'safety-shutdown-slowdown-omd-systems', NULL, NULL),
('eq-me-turngear', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Turning Gear Interlocks & Starter Panel', 'turning-gear-interlocks-starter-panel', NULL, NULL),
('df7adb18-5249-4f1b-89af-37eb87896836', '7f35b4f1-31dd-4bb6-a0db-7bc894da2cc5', 'Others', 'others', NULL, NULL),

-- Auxiliary Engine & Generator (DG)
('a1111111-2222-3333-4444-555555555501', 'c9a81e01-1122-4433-8899-aabbccddeeff', 'Alternator & Excitation System', 'alternator-excitation-system', NULL, NULL),
('a1111111-2222-3333-4444-555555555502', 'c9a81e01-1122-4433-8899-aabbccddeeff', 'Automatic Voltage Regulator (AVR)', 'automatic-voltage-regulator-avr', NULL, NULL),
('a1111111-2222-3333-4444-555555555503', 'c9a81e01-1122-4433-8899-aabbccddeeff', 'Electronic Governor & Actuator', 'electronic-governor-actuator', NULL, NULL),
('a1111111-2222-3333-4444-555555555504', 'c9a81e01-1122-4433-8899-aabbccddeeff', 'Turbocharger System', 'aux-engine-turbocharger', NULL, NULL),
('a1111111-2222-3333-4444-555555555505', 'c9a81e01-1122-4433-8899-aabbccddeeff', 'Pre-Lubrication Oil Pump', 'pre-lubrication-oil-pump', NULL, NULL),
('a1111111-2222-3333-4444-555555555506', 'c9a81e01-1122-4433-8899-aabbccddeeff', 'Jacket Cooling Water System', 'jacket-cooling-water-system', NULL, NULL),
('a1111111-2222-3333-4444-555555555508', 'c9a81e01-1122-4433-8899-aabbccddeeff', 'Safety Shutdown, Trips & OMD Systems', 'safety-shutdown-trips-omd-systems', NULL, NULL),
('a1111111-2222-3333-4444-555555555509', 'c9a81e01-1122-4433-8899-aabbccddeeff', 'Starting Air System & Solenoid Valve', 'starting-air-solenoid-valve', NULL, NULL),
('a1111111-2222-3333-4444-555555555510', 'c9a81e01-1122-4433-8899-aabbccddeeff', 'Local Engine Control Panel (LCP) & Sensors', 'local-control-panel-sensors', NULL, NULL),
('a1111111-2222-3333-4444-555555555511', 'c9a81e01-1122-4433-8899-aabbccddeeff', 'Others', 'others', NULL, NULL),

-- Purifiers
('839d5dfe-454c-47ee-80e4-081639d944db', '6ac2ee2c-5e89-4785-b48b-bffebfbf3145', 'Lube Oil Purifier', 'lube-oil-purifier', NULL, NULL),
('c36a1dfe-0a68-4f0a-8900-3795f230a3aa', '6ac2ee2c-5e89-4785-b48b-bffebfbf3145', 'Fuel Oil Purifier', 'fuel-oil-purifier', NULL, NULL),
('0a891e37-e14e-4338-ad3b-ae2f133dc9dc', '6ac2ee2c-5e89-4785-b48b-bffebfbf3145', 'Viscosity Control & Viscosensor Systems', 'viscosity-control-and-viscosensor-systems', NULL, NULL),
('297e8510-77b9-46a1-81cf-8df352c8eaee', '6ac2ee2c-5e89-4785-b48b-bffebfbf3145', 'Others', 'others', NULL, NULL),

-- Boilers
('63ffe63b-f0aa-488b-bf8b-b40b353cd7cf', 'fbfd1062-6206-4a63-829f-7c8f80af6371', 'Flame Sensor & Safety Cut-offs', 'flame-sensor-and-safety-cut-offs', NULL, NULL),
('d6ed6531-edd9-4972-917c-10ba2e943c82', 'fbfd1062-6206-4a63-829f-7c8f80af6371', 'Water Level Control & Gauge Glass', 'water-level-control-and-gauge-glass', NULL, NULL),
('8fbe4823-65a7-425a-a9e1-d124c44d14cc', 'fbfd1062-6206-4a63-829f-7c8f80af6371', 'Soot Blower System', 'soot-blower-system', NULL, NULL),
('2cc97072-63f0-41b0-9a61-bc41dbc6b21b', 'fbfd1062-6206-4a63-829f-7c8f80af6371', 'Burner & Ignition System', 'burner-and-ignition-system', NULL, NULL),
('a2d892b0-7c14-4687-88b6-f4f7d3865047', 'fbfd1062-6206-4a63-829f-7c8f80af6371', 'Others', 'others', NULL, NULL),

-- Compressors
('5302e421-68f9-4ad4-bd16-d09f9a15e29c', 'fb045fed-0351-4e75-9d55-c6b4a54cf577', 'Main Air Compressor', 'main-air-compressor', NULL, NULL),
('1fb0953d-8a82-4164-bd04-aba62a36af9f', 'fb045fed-0351-4e75-9d55-c6b4a54cf577', 'Control Air Compressor', 'control-air-compressor', NULL, NULL),
('fe5f4f2d-1c4c-4f21-a18c-206847431339', 'fb045fed-0351-4e75-9d55-c6b4a54cf577', 'Emergency Air Compressor', 'emergency-air-compressor', NULL, NULL),
('f76e2420-0c98-406d-854b-c94419bc6434', 'fb045fed-0351-4e75-9d55-c6b4a54cf577', 'Others', 'others', NULL, NULL),

-- Pumps
('163592b6-dd27-433d-84cc-96d32d667f0a', '571777fa-6e1b-4d62-b630-074ee029d7a0', 'Fire & GS Pump', 'fire-and-gs-pump', NULL, NULL),
('4d1ce62e-dadd-4156-9ed5-6da0d64efe8c', '571777fa-6e1b-4d62-b630-074ee029d7a0', 'Fuel Oil Transfer Pump', 'fuel-oil-transfer-pump', NULL, NULL),
('2e6a69c7-374e-43d8-80bd-432b3f3feae1', '571777fa-6e1b-4d62-b630-074ee029d7a0', 'Feed Pump', 'feed-pump', NULL, NULL),
('b8286140-ced2-41c4-9cc0-8f0062676cac', '571777fa-6e1b-4d62-b630-074ee029d7a0', 'Sludge Pump', 'sludge-pump', NULL, NULL),
('30907f0e-1fe2-49fb-9703-469436fea030', '571777fa-6e1b-4d62-b630-074ee029d7a0', 'Cooling Water Pump', 'cooling-water-pump', NULL, NULL),
('ad7a08c6-703b-4bdd-a3a9-954cbf0657e1', '571777fa-6e1b-4d62-b630-074ee029d7a0', 'Bilge Pump', 'bilge-pump', NULL, NULL),
('3833ef39-7d7f-4823-80b0-6c16dc19237e', '571777fa-6e1b-4d62-b630-074ee029d7a0', 'Lube Oil Pump', 'lube-oil-pump', NULL, NULL),
('3546c257-8588-4129-8468-662e12b096f7', '571777fa-6e1b-4d62-b630-074ee029d7a0', 'Others', 'others', NULL, NULL),

-- Auxiliary Systems
('279255b7-82b4-4d93-8bc1-97c357902d53', '3b6be6de-3299-44c1-9498-4c8f5d7ef1d7', 'Fresh Water Generator (FWG)', 'fresh-water-generator-(fwg)', NULL, NULL),
('db550909-0fa4-4592-bc22-8d182387947c', '3b6be6de-3299-44c1-9498-4c8f5d7ef1d7', 'Sewage Treatment Plant (STP)', 'sewage-treatment-plant-(stp)', NULL, NULL),
('abafe44e-2aa9-46e6-9e97-e58541958723', '3b6be6de-3299-44c1-9498-4c8f5d7ef1d7', 'Incinerator', 'incinerator', NULL, NULL),
('aa997144-b6d7-4b2d-82eb-d358bcc5f1d7', '3b6be6de-3299-44c1-9498-4c8f5d7ef1d7', 'Oily Water Separator (OWS)', 'oily-water-separator-(ows)', NULL, NULL),
('53205095-8c9b-49ae-bfa0-9e4da989743e', '3b6be6de-3299-44c1-9498-4c8f5d7ef1d7', 'Others', 'others', NULL, NULL),

-- Power Generation & Distribution (High Voltage, Low Voltage & Distribution)
('eq-pgd-hvsb', '88409ce8-a84c-4d9d-b857-e4b09acaf626', 'High Voltage Switchboard (HVSB & VCB)', 'high-voltage-switchboard-hvsb', NULL, NULL),
('eq-pgd-msb', '88409ce8-a84c-4d9d-b857-e4b09acaf626', 'Main Switchboard (MSB / LVSB & ACB)', 'main-switchboard-msb-lvsb-acb', NULL, NULL),
('eq-pgd-esb', '88409ce8-a84c-4d9d-b857-e4b09acaf626', 'Emergency Switchboard (ESB)', 'emergency-switchboard-esb', NULL, NULL),
('eq-pgd-pms', '88409ce8-a84c-4d9d-b857-e4b09acaf626', 'Power Management System (PMS)', 'power-management-system-pms', NULL, NULL),
('eq-pgd-shaftgen', '88409ce8-a84c-4d9d-b857-e4b09acaf626', 'Shaft Generator & Frequency Inverter (PTO/PTI)', 'shaft-generator-frequency-inverter', NULL, NULL),
('eq-pgd-shore', '88409ce8-a84c-4d9d-b857-e4b09acaf626', 'Shore Power Connection Box (Cold Ironing / AMP)', 'shore-power-connection-box', NULL, NULL),
('eq-pgd-trans', '88409ce8-a84c-4d9d-b857-e4b09acaf626', 'Distribution Transformers (440V / 220V / 115V)', 'distribution-transformers-440v-220v', NULL, NULL),
('eq-pgd-ups', '88409ce8-a84c-4d9d-b857-e4b09acaf626', 'UPS & 24V DC Battery Charger Distribution', 'ups-24v-dc-battery-distribution', NULL, NULL),
('eq-pgd-earth', '88409ce8-a84c-4d9d-b857-e4b09acaf626', 'Earth Fault Monitoring & Insulation Relays', 'earth-fault-monitoring-insulation-relays', NULL, NULL),
('bd412747-f853-4bdc-9e3f-ea708096551a', '88409ce8-a84c-4d9d-b857-e4b09acaf626', 'Others', 'others', NULL, NULL),

-- Instrumentation & Control
('da44c5d7-8410-4cef-8e9b-15a225af99f3', 'b4220464-1880-48b7-ae81-a60a013b2d13', 'AMS', 'ams', NULL, NULL),
('718d8174-f8a3-4651-bcb3-8e3313ad0f24', 'b4220464-1880-48b7-ae81-a60a013b2d13', 'Sensor & Switch Calibration Procedures', 'sensor-and-switch-calibration-procedures', NULL, NULL),
('d751ff2a-ff27-40b2-b7c7-47b62cad7baf', 'b4220464-1880-48b7-ae81-a60a013b2d13', 'Sensors', 'sensors', NULL, NULL),
('b9bd5b2d-c4b0-473d-abb2-280452a7777f', 'b4220464-1880-48b7-ae81-a60a013b2d13', 'Oil Tank Level Sensors', 'oil-tank-level-sensors', NULL, NULL),
('88e9c1ff-0eb0-49cb-ae3b-71751c446329', 'b4220464-1880-48b7-ae81-a60a013b2d13', 'Bilge Tank Level Switches & Alarms', 'bilge-tank-level-switches-and-alarms', NULL, NULL),
('5248108a-c0ad-4c8b-a2c1-1ad16c25a2fc', 'b4220464-1880-48b7-ae81-a60a013b2d13', 'Transmitters', 'transmitters', NULL, NULL),
('79268e70-0cd3-40fd-96f0-5daad0286bf7', 'b4220464-1880-48b7-ae81-a60a013b2d13', 'Ballast Tank Level Sensors', 'ballast-tank-level-sensors', NULL, NULL),
('1ca46bcb-e4ad-45ce-87bf-edcd77a791d7', 'b4220464-1880-48b7-ae81-a60a013b2d13', 'Others', 'others', NULL, NULL),

-- Safety & Fire Protection
('cfb44ade-38c6-4025-8e1d-520a1bf4a870', '6401f03f-42d3-4f4a-a175-e67f4211ebed', 'Fire Detection & Alarm System', 'fire-detection-and-alarm-system', NULL, NULL),
('6174f0f1-e8c6-484d-ab2d-4e66fc421acc', '6401f03f-42d3-4f4a-a175-e67f4211ebed', 'Fixed CO2 System', 'fixed-co2-system', NULL, NULL),
('b66dafa1-5abf-4eee-9245-80e3513ce9ab', '6401f03f-42d3-4f4a-a175-e67f4211ebed', 'Fire Dampers', 'fire-dampers', NULL, NULL),
('94f23af4-22ed-449e-ba26-be1c80af3ae6', '6401f03f-42d3-4f4a-a175-e67f4211ebed', 'Hyper-Mist System', 'hyper-mist-system', NULL, NULL),
('63520ce7-9c8a-4591-bae6-b485d66fb52e', '6401f03f-42d3-4f4a-a175-e67f4211ebed', 'Emergency Fire Pump Starter', 'emergency-fire-pump-starter', NULL, NULL),
('027f9da7-ed47-4109-87a1-07c5918c9e20', '6401f03f-42d3-4f4a-a175-e67f4211ebed', 'Others', 'others', NULL, NULL),

-- Accommodation & Domestic Electricals
('03ca584f-125a-4a39-81ac-d45576c360f9', 'd83e6c0e-854f-44c9-b0be-59a774b584f6', 'Packaged AC', 'packaged-ac', NULL, NULL),
('7537bda2-e36b-47ad-a9b8-e97aba0cb393', 'd83e6c0e-854f-44c9-b0be-59a774b584f6', 'Navigation & Deck Lighting', 'navigation-and-deck-lighting', NULL, NULL),
('76260076-6783-4505-b153-0626527bd68a', 'd83e6c0e-854f-44c9-b0be-59a774b584f6', 'Galley & Laundry Equipment', 'galley-and-laundry-equipment', NULL, NULL),
('7ab1ce78-1c40-489c-85c0-793b847484b1', 'd83e6c0e-854f-44c9-b0be-59a774b584f6', 'Accommodation AC & AHU', 'accommodation-ac-and-ahu', NULL, NULL),
('cfb8fe94-9a5e-4d61-9023-aca257f42bf3', 'd83e6c0e-854f-44c9-b0be-59a774b584f6', 'PA System & Alarms', 'pa-system-and-alarms', NULL, NULL),
('7392b4ec-6fda-4a78-80f9-705c71219cdc', 'd83e6c0e-854f-44c9-b0be-59a774b584f6', 'Provision Reefer Plant', 'provision-reefer-plant', NULL, NULL),
('421b7e52-6b27-48ad-81dc-a8e9d09b37c9', 'd83e6c0e-854f-44c9-b0be-59a774b584f6', 'Others', 'others', NULL, NULL),

-- Reefer Systems
('0a5ff81f-49e7-43f5-ba2f-0834fd3b4d93', 'f36f4d66-88b8-4fdb-b7d2-7273839c5b44', 'Daikin', 'daikin', NULL, NULL),
('5e85727a-a8e3-4000-9d77-cb48dc51d1b9', 'f36f4d66-88b8-4fdb-b7d2-7273839c5b44', 'Carrier', 'carrier', NULL, NULL),
('53748963-3263-4579-b6b6-dcd3515cf59a', 'f36f4d66-88b8-4fdb-b7d2-7273839c5b44', 'Thermo King', 'thermo-king', NULL, NULL),
('16fe7e54-1192-4e49-99d8-90e1ca839614', 'f36f4d66-88b8-4fdb-b7d2-7273839c5b44', 'Star Cool', 'star-cool', NULL, NULL),
('d4c64643-a636-40dc-83d6-c4661d6a2781', 'f36f4d66-88b8-4fdb-b7d2-7273839c5b44', 'Others', 'others', NULL, NULL),

-- Others (General Machinery)
('e2222222-3333-4444-5555-666666666601', 'e1a93b44-9988-4433-2211-ffeeddccbbaa', 'Workshop Machinery & Tools (Lathe/Drill/Welder)', 'workshop-machinery-tools', NULL, NULL),
('e2222222-3333-4444-5555-666666666602', 'e1a93b44-9988-4433-2211-ffeeddccbbaa', 'General Marine Valves & Actuators', 'general-marine-valves-actuators', NULL, NULL),
('e2222222-3333-4444-5555-666666666603', 'e1a93b44-9988-4433-2211-ffeeddccbbaa', 'Miscellaneous Systems', 'miscellaneous-systems', NULL, NULL);