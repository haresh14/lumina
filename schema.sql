-- Daily Logs Table
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    mood INTEGER CHECK (mood >= 1 AND mood <= 5) NOT NULL,
    energy INTEGER CHECK (energy >= 1 AND energy <= 5) NOT NULL,
    sleep FLOAT CHECK (sleep >= 0 AND sleep <= 24) NOT NULL,
    interventions TEXT[] DEFAULT '{}',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can create their own logs"
ON public.logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own logs"
ON public.logs
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
ON public.logs
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
ON public.logs
FOR DELETE
USING (auth.uid() = user_id);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS logs_user_id_idx ON public.logs(user_id);
CREATE INDEX IF NOT EXISTS logs_created_at_idx ON public.logs(created_at);
