CREATE TABLE IF NOT EXISTS tracking (
    id UUID DEFAULT gen_random_uuid(),
    pixel_id TEXT DEFAULT gen_random_uuid(),
    user_agent VARCHAR(500),
    ip VARCHAR(100),
    referrer TEXT, 
    origin TEXT, 
    country VARCHAR(100),
    state VARCHAR(100),
    neighborhood VARCHAR(100),
    latitude VARCHAR(50),
    longitude VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT (now() AT TIME ZONE 'utc') NOT NULL,
    PRIMARY KEY (id)
);
