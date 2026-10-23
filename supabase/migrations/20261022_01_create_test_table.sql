-- Create test table with two fields
-- Migration: 20261022_01_create_test_table

CREATE TABLE test_table (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    field_a TEXT,
    field_b INTEGER
);