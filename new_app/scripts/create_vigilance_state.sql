-- Create a table to track the last known vigilance state
create table if not exists vigilance_state (
  id int primary key generated always as identity,
  color_id int not null,
  color_name text not null,
  updated_at timestamptz default now()
);

-- Insert a default 'green' state if empty
insert into vigilance_state (color_id, color_name)
select 1, 'vert'
where not exists (select 1 from vigilance_state);
