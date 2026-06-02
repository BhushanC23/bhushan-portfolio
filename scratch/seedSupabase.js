import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import { BHUSHAN_DATA } from '../src/data/bhushanData.js';

// 1. Manually parse .env file
function parseEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error('.env file not found at ' + envPath);
  }
  const content = fs.readFileSync(envPath, 'utf-8');
  const env = {};
  content.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const match = trimmed.match(/^([^=]+)=(.*)$/);
    if (match) {
      let key = match[1].trim();
      let value = match[2].trim();
      // Remove surrounding quotes if any
      if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.substring(1, value.length - 1);
      }
      env[key] = value;
    }
  });
  return env;
}

async function run() {
  console.log('🚀 Loading environment variables...');
  const env = parseEnv();
  const supabaseUrl = env.VITE_SUPABASE_URL;
  const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase credentials missing in .env!');
    process.exit(1);
  }

  console.log('🔗 Connecting to Supabase at:', supabaseUrl);
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  // --- SEED ABOUT ---
  console.log('\n📝 Seeding "about" section...');
  const aboutPayload = {
    bio: BHUSHAN_DATA.about.bio,
    photo_url: BHUSHAN_DATA.about.photo_url || '',
  };

  // We check if a record exists in "about"
  const { data: aboutData, error: aboutFetchError } = await supabase.from('about').select('id').limit(1);
  if (aboutFetchError) {
    console.error('❌ Error reading "about" table:', aboutFetchError.message);
  } else if (aboutData && aboutData.length > 0) {
    const existingId = aboutData[0].id;
    console.log(`Updating existing "about" record ID: ${existingId}`);
    const { error: updateErr } = await supabase.from('about').update(aboutPayload).eq('id', existingId);
    if (updateErr) console.error('❌ Error updating "about":', updateErr.message);
    else console.log('✅ "about" table successfully updated!');
  } else {
    console.log('Inserting new "about" record...');
    const { error: insertErr } = await supabase.from('about').insert(aboutPayload);
    if (insertErr) console.error('❌ Error inserting "about":', insertErr.message);
    else console.log('✅ "about" table successfully populated!');
  }

  // --- SEED HERO TEXT ---
  console.log('\n🎭 Seeding "hero_text" overlays...');
  for (const overlay of BHUSHAN_DATA.heroText) {
    const heroPayload = {
      phase: overlay.phase,
      title: overlay.title,
      title2: overlay.title2 || '',
      subtitle: overlay.subtitle,
      tag: overlay.tag || '',
    };

    // Check if phase already exists
    const { data: existingPhase, error: phaseErr } = await supabase
      .from('hero_text')
      .select('id')
      .eq('phase', overlay.phase)
      .limit(1);

    if (phaseErr) {
      console.error(`❌ Error querying "hero_text" phase ${overlay.phase}:`, phaseErr.message);
    } else if (existingPhase && existingPhase.length > 0) {
      console.log(`Updating existing phase ${overlay.phase} (ID: ${existingPhase[0].id})`);
      const { error: updateErr } = await supabase
        .from('hero_text')
        .update(heroPayload)
        .eq('id', existingPhase[0].id);
      if (updateErr) console.error(`❌ Error updating phase ${overlay.phase}:`, updateErr.message);
      else console.log(`✅ Phase ${overlay.phase} successfully updated!`);
    } else {
      console.log(`Inserting new phase ${overlay.phase}`);
      const { error: insertErr } = await supabase.from('hero_text').insert(heroPayload);
      if (insertErr) console.error(`❌ Error inserting phase ${overlay.phase}:`, insertErr.message);
      else console.log(`✅ Phase ${overlay.phase} successfully populated!`);
    }
  }

  // --- SEED PROJECTS ---
  console.log('\n📂 Seeding "projects" table...');
  // We want to avoid duplicates. Since name/title is a good identifier, we will query existing and upsert/insert.
  const { data: existingProjects, error: projFetchErr } = await supabase.from('projects').select('id, title');
  if (projFetchErr) {
    console.error('❌ Error fetching existing projects:', projFetchErr.message);
  } else {
    for (const proj of BHUSHAN_DATA.projects) {
      const projPayload = {
        title: proj.name,
        desc: proj.description,
        tech: proj.stack,
        github: proj.github,
        demo: proj.demo || '',
        tag: proj.tag,
        featured: proj.featured,
      };

      const match = existingProjects?.find(p => p.title.toLowerCase() === proj.name.toLowerCase());
      if (match) {
        console.log(`Updating existing project "${proj.name}" (ID: ${match.id})`);
        const { error: updateErr } = await supabase.from('projects').update(projPayload).eq('id', match.id);
        if (updateErr) console.error(`❌ Error updating project "${proj.name}":`, updateErr.message);
        else console.log(`✅ Project "${proj.name}" successfully updated!`);
      } else {
        console.log(`Inserting new project "${proj.name}"`);
        const { error: insertErr } = await supabase.from('projects').insert(projPayload);
        if (insertErr) console.error(`❌ Error inserting project "${proj.name}":`, insertErr.message);
        else console.log(`✅ Project "${proj.name}" successfully inserted!`);
      }
    }
  }

  // --- SEED SKILLS ---
  console.log('\n🛠️ Seeding "skills" categories...');
  for (const [category, items] of Object.entries(BHUSHAN_DATA.skills)) {
    console.log(`Upserting skills category "${category}" with ${items.length} items`);
    const { error: skillErr } = await supabase
      .from('skills')
      .upsert({ category, items }, { onConflict: 'category' });

    if (skillErr) {
      console.error(`❌ Error upserting skills category "${category}":`, skillErr.message);
    } else {
      console.log(`✅ Skills category "${category}" successfully seeded!`);
    }
  }

  console.log('\n✨ Database seeding completed!');
}

run().catch(err => {
  console.error('❌ Seeding failed catastrophically:', err);
});
