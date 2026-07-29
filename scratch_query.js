const { createClient } = require("@supabase/supabase-js");

const SUPABASE_URL = "https://xrmuhmxfqmimcuihtxie.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhybXVobXhmcW1pbWN1aWh0eGllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAxMDkwNTQsImV4cCI6MjA5NTY4NTA1NH0.1kK5dvGFa1Gw93ZKDJ4NmmuAtFrlliw6-_ZBGWybcVc";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function run() {
  console.log("=== CUSTOMERS ===");
  const { data: customers, error: errC } = await supabase
    .from("customers")
    .select("*");
  if (errC) console.error("Error customers:", errC);
  else {
    customers.forEach(c => {
      console.log(`ID: ${c.id} | Nama: ${c.nama} | Status: ${c.status} | Expiry: ${c.expiry_date}`);
    });
  }

  console.log("\n=== INVITATIONS ===");
  const { data: invitations, error: errI } = await supabase
    .from("invitations")
    .select("*");
  if (errI) console.error("Error invitations:", errI);
  else {
    invitations.forEach(i => {
      console.log(`ID: ${i.id} | CustomerID: ${i.customer_id} | Slug: ${i.slug} | Status: ${i.status} | undangan_aktif: ${i.undangan_aktif} | has_editorData: ${!!i.editor_data}`);
      if (i.editor_data) {
        console.log(`  editor_data.undanganAktif: ${i.editor_data.undanganAktif}`);
        console.log(`  editor_data.undangan?.undanganAktif: ${i.editor_data.undangan?.undanganAktif}`);
      }
    });
  }
}

run();
