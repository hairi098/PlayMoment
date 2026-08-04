<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useUndanganStore } from "@/stores/useUndanganStore";
import { useAccountStore } from "@/stores/useAccountStore";

const store = useUndanganStore();
const accountStore = useAccountStore();

const isOpen = ref(false);
const lightIsOn = ref(false);
const modalProfile = ref(false);
const modalGift = ref(false);
const modalGallery = ref(false);
const modalRsvp = ref(false);
const modalEvent = ref(false);
const modalLoveStory = ref(false);
const modalDresscode = ref(false);
const modalMaps = ref(false);
const modalSalam = ref(false);

const template = ref({
  id: 1,
  name: "cafe",
  description: "tema cafe lucu dan sederhana",
  image_url: "/themes/lucu/preview.png",
  price: 10000,
  discount_price: 8000,
  is_active: true,
  bg_desktop_url: "/themes/onepiece/bg-desktop.jpeg",
  bg_mobile_url: "/themes/onepiece/bg-mobile.jpeg",
  assets: [
    {
      key: "profile",
      Image_url: "/themes/onepiece/profile.png",
      Width: " 77%",
      top: "35%",
      left: "12%",
    },
    {
      key: "gift",
      Image_url: "/themes/onepiece/gift.png",
      Width: "28%",
      top: "50%",
      left: "1.4%",
    },
    {
      key: "gallery",
      Image_url: "/themes/onepiece/gallery.png",
      Width: "30%",
      top: "17.8%",
      left: "18.8%",
    },
    {
      key: "rsvp",
      Image_url: "/themes/onepiece/rsvp.png",
      Width: "48%",
      top: "75.5%",
      left: "48.4%",
    },
    {
      key: "event",
      Image_url: "/themes/onepiece/event.png",
      Width: "35.5%",
      top: "37.5%",
      left: "63%",
    },
    {
      key: "dresscode",
      Image_url: "/themes/onepiece/drescode.png",
      Width: "42%",
      top: "31%",
      left: "2%",
    },
    {
      key: "maps",
      Image_url: "/themes/onepiece/maps.png",
      Width: "38%",
      top: "68%",
      left: "27%",
    },
    {
      key: "lovestory",
      Image_url: "/themes/onepiece/love-story.png",
      Width: "36%",
      top: "54%",
      left: "68%",
    },
    {
      key: "salam",
      Image_url: "/themes/onepiece/salam.png",
      Width: "40.5%",
      top: "68%",
      left: "2%",
    },
  ],
});

// ── GALERI: dari store.undangan.galeri (foto upload user)
const galleries = computed(() => {
  const galeri = store.undangan.galeri || [];
  return galeri
    .map((url: string | null, i: number) => ({ image_url: url || `https://picsum.photos/seed/galeri${i}/400/300` }));
});

// ── GIFT / REKENING: dari store
const gifts = computed(() => [
  {
    image_url: store.undangan.logoBank || "/assets/invitations/bca.jpg",
    bank: store.undangan.namaBankRekening || "Nama Bank",
    account_number: store.undangan.nomorRekening || "-",
    account_name: store.undangan.namaRekening || "-",
  },
]);

// ── LOVE STORY: dari store.sectionContents.lovestory.items
const LoveStorys = computed(() => {
  const items = (store.sectionContents as any).lovestory?.items;
  if (items && Array.isArray(items) && items.length) return items;
  return [
    {
      image_url: "https://picsum.photos/seed/love/300/200",
      title: "Pertemuan Pertama",
      description: "Kami bertemu di sebuah kafe kecil di pinggir kota.",
      date: "2020-01-15",
    },
    {
      image_url: "https://picsum.photos/seed/picsum/300/200",
      title: "Kencan Pertama",
      description: "Kencan pertama kami di taman bunga yang indah, penuh warna dan tawa.",
      date: "2020-02-20",
    },
    {
      image_url: "https://picsum.photos/seed/wood/300/200",
      title: "Engagement",
      description: "Momen yang sangat berkesan dan tidak terlupakan.",
      date: "2021-06-10",
    },
    {
      image_url: "https://picsum.photos/seed/jungle/400/200",
      title: "Ceremony",
      description: "Hari bahagia yang kami nantikan akhirnya tiba.",
      date: "2022-12-12",
    },
  ];
});

// ── PROFIL MEMPELAI: dari store
const profiles = computed(() => [
  {
    image_url: store.undangan.fotoBride || "https://picsum.photos/seed/bride/300/400",
    name: store.undangan.nama1 || "Nama Mempelai Wanita",
    namaLengkap: (store.sectionContents as any).bride?.namaLengkap || "",
    bio: (store.sectionContents as any).bride?.orangTua || "",
    instagram: store.undangan.instagramBride || "@instagram",
    igLink: (store.sectionContents as any).bride?.igLink || "",
    label: (store.sectionContents as any).bride?.labelSub || "Mempelai Wanita",
  },
  {
    image_url: store.undangan.fotoGroom || "https://picsum.photos/seed/groom/300/400",
    name: store.undangan.nama2 || "Nama Mempelai Pria",
    namaLengkap: (store.sectionContents as any).groom?.namaLengkap || "",
    bio: (store.sectionContents as any).groom?.orangTua || "",
    instagram: store.undangan.instagramGroom || "@instagram",
    igLink: (store.sectionContents as any).groom?.igLink || "",
    label: (store.sectionContents as any).groom?.labelSub || "Mempelai Pria",
  },
]);

// ── ACARA / EVENT: dari store
const events = computed(() => [
  {
    name: (store.sectionContents as any).acara?.judulAkad || "Akad Nikah",
    date: store.undangan.tanggalAkad || "-",
    time: store.undangan.waktuAkad || "-",
    location: store.undangan.lokasiAkad || "-",
    address: store.undangan.alamatAkad || "-",
    mapsLink: store.undangan.linkMapsAkad || "",
    mapsText: (store.sectionContents as any).acara?.mapsAkad || "Lihat di Google Maps",
  },
  {
    name: "Resepsi",
    date: store.undangan.tanggalResepsi || "-",
    time: store.undangan.waktuResepsi || "-",
    location: store.undangan.lokasiResepsi || "-",
    address: store.undangan.alamatResepsi || "-",
    mapsLink: store.undangan.linkMapsResepsi || "",
    mapsText: (store.sectionContents as any).acara?.mapsResepsi || "Lihat di Google Maps",
  },
]);

// ── DRESSCODE: dari store.sectionContents.dresscode
const dresscode = computed(() => ({
  theme: (store.sectionContents as any).dresscode?.theme || "Elegant Garden",
  colors: (store.sectionContents as any).dresscode?.colors || ["Sage Green", "Dusty Rose", "Cream"],
  description: (store.sectionContents as any).dresscode?.description || "Kami mengundang Anda untuk mengenakan pakaian dengan nuansa taman yang elegan.",
  image_url: store.undangan.dresscodeImage || "https://picsum.photos/seed/dresscode/400/300",
}));

// ── MAPS: dari store
const mapLocation = computed(() => {
  const link = store.undangan.linkMapsResepsi || "https://maps.google.com/?q=-6.200000,106.816666";
  // Coba ekstrak embed dari link Google Maps biasa
  let embedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.666!2d106.816666!3d-6.200000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDknMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890";
  return {
    judul: (store.sectionContents as any).maps?.judul || "Lokasi Acara",
    desc: (store.sectionContents as any).maps?.desc || "",
    venue: store.undangan.lokasiResepsi || "Lokasi Acara",
    address: store.undangan.alamatResepsi || "-",
    google_maps_url: link,
    embed_url: embedUrl,
    btnText: (store.sectionContents as any).maps?.btnText || "Buka di Google Maps",
  };
});

// ── SALAM / PENUTUP: dari store
const salamMessage = computed(() => ({
  judul: (store.sectionContents as any).salam?.judul || "Assalamualaikum Warahmatullahi Wabarakatuh",
  message: (store.sectionContents as any).salam?.message ||
    "Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.",
  penutup: (store.sectionContents as any).penutup?.desc || "",
  hormat: (store.sectionContents as any).penutup?.hormat || "Kami yang berbahagia,",
  signature: `${store.undangan.nama1 || "Nama Wanita"} ${(store.sectionContents as any).penutup?.ampersand || "&"} ${store.undangan.nama2 || "Nama Pria"}`,
  image_url: store.undangan.fotoCouple || "https://picsum.photos/seed/salam/400/300",
}));

// ── OPENING / COVER: dari store
const openingData = computed(() => ({
  kepadaYth: (store.sectionContents as any).opening?.kepadaYth || "Kepada Yth.",
  namaTamu: (store.undangan as any).namaTamu || "Nama Tamu Undangan",
  btnText: (store.sectionContents as any).opening?.btnText || "▶ Play Invitation",
  judul: store.undangan.judul || "The Wedding Of ...",
}));

// ── RSVP: konfigurasi dari store.rsvpFields
const rsvpConfig = computed(() => {
  const fields = store.rsvpFields || []
  return {
    showNama:      fields.find((f: any) => f.key === 'nama')?.active ?? true,
    showJumlah:    fields.find((f: any) => f.key === 'jumlah')?.active ?? true,
    showPesan:     fields.find((f: any) => f.key === 'pesan')?.active ?? true,
    showKonfirmasi:fields.find((f: any) => f.key === 'konfirmasi')?.active ?? true,
    judul:         (store.sectionContents as any).rsvp?.judul || "Konfirmasi Kehadiran",
    desc:          (store.sectionContents as any).rsvp?.desc || "",
    batas:         (store.sectionContents as any).rsvp?.batasKonfirmasi || "",
    btnText:       (store.sectionContents as any).rsvp?.btnText || "Kirim RSVP",
    btnTextAfter:  (store.sectionContents as any).rsvp?.btnTextAfter || "Terima Kasih! 🎉",
  }
});

// ── RUNDOWN: dari store
const rundownData = computed(() => ({
  judul: (store.sectionContents as any).rundown?.judul || "Rundown Acara",
  desc: (store.sectionContents as any).rundown?.desc || "",
  items: (store.sectionContents as any).rundown?.items || [],
}));

// ── QUOTES: dari store
const quotesData = computed(() => ({
  text: (store.sectionContents as any).quotes?.text || "",
  text2: (store.sectionContents as any).quotes?.text2 || "",
  source: (store.sectionContents as any).quotes?.source || "",
}));

// 0 = Tidak Hadir. 1 = Hadir, 2 = Mungkin hadir
interface Guest {
  name: string | null;
  phone: string | null;
  comment: string | null;
  attendance: 0 | 1 | 2;
}

const guests = ref<Guest[]>([
  {
    name: "Hairi",
    phone: "081234567890",
    comment: "Selamat yaa",
    attendance: 1,
  },
]);

const attendancestatus: Record<number, string> = {
  0: "Tidak Hadir",
  1: "Hadir",
  2: "Mungkin Hadir",
};

const attendanceStatus = Object.entries(attendancestatus).map(
  ([value, label]) => ({
    value: Number(value),
    label,
  }),
);

const newGuest = ref<Guest>({
  name: null,
  phone: null,
  comment: null,
  attendance: 1,
});

const rsvpSubmitted = ref(false);

onMounted(() => {
  if (store.daftarTamu && store.daftarTamu.length > 0) {
    guests.value = store.daftarTamu.map((t: any) => ({
      name: t.nama,
      phone: t.whatsapp || t.phone || null,
      comment: t.ucapan || t.comment || null,
      attendance: t.hadir ? 1 : 0,
    }));
  }
});

const handleRsvp = async () => {
  try {
    const isHadir = newGuest.value.attendance === 1 || String(newGuest.value.attendance) === "Hadir";
    const res = await accountStore.submitPublicRsvp(store.editorId, {
      name: newGuest.value.name,
      phone: newGuest.value.phone,
      jumlah: 1,
      attendance: isHadir ? "Hadir" : "Tidak Hadir",
      comment: newGuest.value.comment,
    });
    if (res.ok) {
      guests.value = (res.daftarTamu || []).map((t: any) => ({
        name: t.nama,
        phone: t.whatsapp || t.phone || null,
        comment: t.ucapan || t.comment || null,
        attendance: t.hadir ? 1 : 0,
      }));
      newGuest.value = {
        name: null,
        phone: null,
        comment: null,
        attendance: 1,
      };
      rsvpSubmitted.value = true;
      setTimeout(() => (rsvpSubmitted.value = false), 3000);
    }
  } catch (error) {
    console.error("Error submitting RSVP:", error);
  }
};

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text);
  alert("Nomor rekening berhasil disalin!");
};

const clickAsset = (key: string) => {
  switch (key) {
    case "profile":
      modalProfile.value = !modalProfile.value;
      break;
    case "gift":
      modalGift.value = !modalGift.value;
      break;
    case "gallery":
      modalGallery.value = !modalGallery.value;
      break;
    case "rsvp":
      modalRsvp.value = !modalRsvp.value;
      break;
    case "event":
      modalEvent.value = !modalEvent.value;
      break;
    case "lovestory":
      modalLoveStory.value = !modalLoveStory.value;
      break;
    case "dresscode":
      modalDresscode.value = !modalDresscode.value;
      break;
    case "maps":
      modalMaps.value = !modalMaps.value;
      break;
    case "salam":
      modalSalam.value = !modalSalam.value;
      break;
    default:
      break;
  }
};
</script>

<template>
  <section>
    <div
      class="scane hidden sm:block"
      :style="{ backgroundImage: `url(${template.bg_desktop_url})` }"
    >
      <div v-if="lightIsOn" class="absolute inset-0 bg-gray-900/60"></div>
    </div>
    <div
      class="drawer"
      :class="{ 'light-on': lightIsOn }"
      :style="{ backgroundImage: `url(${template.bg_mobile_url})` }"
    >
      <div v-if="lightIsOn" class="absolute inset-0 bg-gray-900/60"></div>

      <UButton
        icon="i-lucide-lightbulb"
        color="warning"
        class="light absolute right-4 rounded-full border-2"
        @click="lightIsOn = !lightIsOn"
      />

      <!-- CLICKABLE ASSETS -->
      <img
        v-for="asset in template.assets"
        :src="asset.Image_url"
        :key="asset.key"
        @click.prevent="clickAsset(asset.key)"
        :style="[
          { width: asset.Width },
          { top: asset.top },
          { left: asset.left },
        ]"
        class="glow absolute zoom-in-out"
      />

      <!-- ══ MODAL GALLERY ══ -->
      <UModal
        v-model:open="modalGallery"
        :title="'Gallery'"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <div class="columns-2 gap-2 space-y-2">
            <img
              v-for="(img, i) in galleries"
              :src="img.image_url"
              alt="foto galeri"
              class="rounded-md w-full break-inside-avoid"
              :key="i"
            />
          </div>
        </template>
      </UModal>

      <!-- ══ MODAL PROFILE MEMPELAI ══ -->
      <UModal
        v-model:open="modalProfile"
        title="Profil Mempelai"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <div class="space-y-3">
            <div
              v-for="(profile, i) in profiles"
              class="bg-white text-black rounded-lg p-4 text-center"
              :key="i"
            >
              <img
                :src="profile.image_url"
                alt="foto mempelai"
                class="h-24 w-24 rounded-full object-cover mb-3 mx-auto border-2 border-gray-200"
              />
              <p class="text-xs text-gray-400 mb-1">{{ profile.label }}</p>
              <div class="font-bold text-lg">{{ profile.name }}</div>
              <div v-if="profile.namaLengkap" class="text-sm text-gray-700 mt-1">{{ profile.namaLengkap }}</div>
              <div v-if="profile.bio" class="text-sm text-gray-500 mt-2 italic leading-relaxed">{{ profile.bio }}</div>
              <div class="mt-4">
                <a
                  :href="profile.igLink || `https://instagram.com/${profile.instagram.replace('@','')}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="inline-block bg-gradient-to-r from-pink-500 to-purple-600 px-4 py-1.5 rounded-full text-white text-sm font-medium"
                >
                  {{ profile.instagram }}
                </a>
              </div>
            </div>
          </div>
        </template>
      </UModal>

      <!-- ══ MODAL EVENT ══ -->
      <UModal
        v-model:open="modalEvent"
        title="Acara"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <div class="space-y-3">
            <div
              v-for="(event, i) in events"
              :key="i"
              class="relative bg-white text-black rounded-xl p-5 shadow-md border border-gray-100"
            >
              <div class="text-center mb-3">
                <h3 class="text-lg font-semibold tracking-wide">
                  {{ event.name }}
                </h3>
                <div class="w-12 h-0.5 bg-gray-300 mx-auto mt-2"></div>
              </div>
              <div class="space-y-2 text-sm text-gray-700">
                <div class="flex items-center justify-center gap-2">
                  <span>📅</span> {{ event.date }}
                </div>
                <div class="flex items-center justify-center gap-2">
                  <span>🕐</span> {{ event.time }}
                </div>
                <div class="flex items-center justify-center gap-2 font-medium">
                  <span>📍</span> {{ event.location }}
                </div>
                <div class="text-center text-sm text-gray-500 px-4">
                  {{ event.address }}
                </div>
              </div>
              <a
                v-if="event.mapsLink"
                :href="event.mapsLink"
                target="_blank"
                rel="noopener noreferrer"
                class="mt-3 block w-full text-center bg-blue-600 text-white py-2 rounded-lg text-sm hover:bg-blue-700 transition"
              >
                {{ event.mapsText }}
              </a>
            </div>
          </div>
        </template>
      </UModal>

      <!-- ══ MODAL LOVE STORY ══ -->
      <UModal
        v-model:open="modalLoveStory"
        :title="(store.sectionContents as any).lovestory?.judul || 'Love Story'"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <p v-if="(store.sectionContents as any).lovestory?.desc" class="text-sm text-gray-500 mb-4">
            {{ (store.sectionContents as any).lovestory?.desc }}
          </p>
          <div class="space-y-3">
            <div
              v-for="(story, i) in LoveStorys"
              :key="i"
              class="bg-white text-black rounded-lg p-3 flex gap-3 items-start"
            >
              <img
                :src="story.image_url"
                alt="foto love story"
                class="w-16 h-16 mt-2 rounded-lg object-cover flex-shrink-0"
              />
              <div class="flex-1">
                <div class="font-semibold">{{ story.title }}</div>
                <div class="italic text-sm text-gray-600">{{ story.description }}</div>
                <div class="text-xs text-gray-400 mt-1">{{ story.date }}</div>
              </div>
            </div>
          </div>
        </template>
      </UModal>

      <!-- ══ MODAL RSVP ══ -->
      <UModal
        v-model:open="modalRsvp"
        :title="rsvpConfig.judul"
        :ui="{ overlay: 'bg-gray-900/70' }"
        :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full',
        }"
      >
        <template #body>
          <!-- Deskripsi & batas konfirmasi -->
          <div v-if="rsvpConfig.desc || rsvpConfig.batas" class="mb-4 text-sm text-gray-500">
            <p v-if="rsvpConfig.desc">{{ rsvpConfig.desc }}</p>
            <p v-if="rsvpConfig.batas" class="mt-1">Batas konfirmasi: <strong>{{ rsvpConfig.batas }}</strong></p>
          </div>

          <!-- Notifikasi sukses -->
          <div v-if="rsvpSubmitted" class="mb-4 bg-green-50 border border-green-200 rounded-lg p-3 text-center text-green-700 text-sm font-medium">
            {{ rsvpConfig.btnTextAfter }}
          </div>

          <form @submit.prevent="handleRsvp" class="space-y-4">
            <UFormField v-if="rsvpConfig.showNama" label="Nama" class="w-full">
              <UInput v-model="newGuest.name" required class="w-full" placeholder="Nama lengkap Anda" />
            </UFormField>
            <UFormField v-if="rsvpConfig.showJumlah" label="Jumlah Kehadiran" class="w-full">
              <UInput v-model="newGuest.phone" required class="w-full" placeholder="Jumlah orang yang hadir" />
            </UFormField>
            <UFormField v-if="rsvpConfig.showKonfirmasi" label="Kehadiran" class="w-full">
              <USelect
                v-model="newGuest.attendance"
                required
                class="w-full"
                :items="attendanceStatus"
              />
            </UFormField>
            <UFormField v-if="rsvpConfig.showPesan" label="Pesan / Ucapan" class="w-full">
              <UTextarea
                v-model="newGuest.comment"
                class="w-full mb-4"
                placeholder="Tulis doa dan ucapan Anda..."
              />
            </UFormField>
            <UButton type="submit" class="w-full justify-center mb-4">
              {{ rsvpConfig.btnText }}
            </UButton>
          </form>

          <!-- Daftar ucapan tamu -->
          <div class="space-y-4 mb-4">
            <div v-for="(guest, index) in guests" :key="index">
              <div class="bg-white text-sm border border-gray-100 text-black rounded-lg p-4 shadow-sm">
                <div>
                  {{ guest.name }}
                  <span
                    class="px-2 text-xs rounded-full ml-2"
                    :class="{
                      'bg-green-200 text-green-800': guest.attendance === 1,
                      'bg-yellow-200 text-yellow-800': guest.attendance === 2,
                      'bg-red-200 text-red-800': guest.attendance === 0,
                    }"
                  >{{ attendancestatus[guest.attendance] }}</span>
                </div>
                <div class="text-gray-500 mt-1">{{ guest.comment }}</div>
              </div>
            </div>
          </div>
        </template>
      </UModal>

      <!-- ══ MODAL GIFT ══ -->
      <UModal
        v-model:open="modalGift"
        :title="(store.sectionContents as any).gift?.judul || 'Amplop Digital'"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <p v-if="(store.sectionContents as any).gift?.desc" class="text-sm text-gray-500 mb-4 leading-relaxed">
            {{ (store.sectionContents as any).gift?.desc }}
          </p>
          <div class="space-y-3">
            <div
              v-for="(gift, i) in gifts"
              :key="i"
              class="bg-white text-black rounded-lg p-4"
            >
              <img
                :src="gift.image_url"
                alt="logo bank"
                class="w-full h-32 object-contain rounded-md mb-3 bg-gray-50 p-2"
              />
              <div class="space-y-2">
                <div class="font-semibold text-lg">{{ gift.bank }}</div>
                <div class="text-sm text-gray-600">
                  <span class="font-medium">Atas Nama:</span> {{ gift.account_name }}
                </div>
                <div class="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span class="font-mono text-sm">{{ gift.account_number }}</span>
                  <UButton
                    size="xs"
                    @click="copyToClipboard(gift.account_number)"
                    icon="i-lucide-copy"
                  >
                    Salin
                  </UButton>
                </div>
              </div>
            </div>
          </div>
        </template>
      </UModal>

      <!-- ══ MODAL DRESSCODE ══ -->
      <UModal
        v-model:open="modalDresscode"
        :title="(store.sectionContents as any).dresscode?.judul || 'Dress Code'"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <div class="bg-white text-black rounded-lg p-5">
            <img
              :src="dresscode.image_url"
              alt="dresscode"
              class="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 class="text-xl font-semibold mb-3">{{ dresscode.theme }}</h3>
            <div class="mb-4">
              <div class="font-medium mb-2">Warna yang Disarankan:</div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(color, i) in dresscode.colors"
                  :key="i"
                  class="px-3 py-1 bg-gray-100 rounded-full text-sm"
                >
                  {{ color }}
                </span>
              </div>
            </div>
            <p class="text-sm text-gray-600 leading-relaxed">
              {{ dresscode.description }}
            </p>
          </div>
        </template>
      </UModal>

      <!-- ══ MODAL MAPS ══ -->
      <UModal
        v-model:open="modalMaps"
        :title="mapLocation.judul"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <div class="bg-white text-black rounded-lg p-4">
            <p v-if="mapLocation.desc" class="text-sm text-gray-500 mb-3">{{ mapLocation.desc }}</p>
            <div class="mb-4">
              <h3 class="font-semibold text-lg mb-1">{{ mapLocation.venue }}</h3>
              <p class="text-sm text-gray-600">{{ mapLocation.address }}</p>
            </div>
            <div class="mb-4 aspect-video rounded-lg overflow-hidden bg-gray-100">
              <ClientOnly>
                <iframe
                  :src="mapLocation.embed_url"
                  class="w-full h-full"
                  loading="lazy"
                />
              </ClientOnly>
            </div>
            <a
              :href="mapLocation.google_maps_url"
              target="_blank"
              rel="noopener noreferrer"
              class="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              {{ mapLocation.btnText }}
            </a>
          </div>
        </template>
      </UModal>

      <!-- ══ MODAL SALAM ══ -->
      <UModal
        v-model:open="modalSalam"
        title="Salam Pembuka"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <div class="bg-white text-black rounded-lg p-5">
            <img
              :src="salamMessage.image_url"
              alt="foto couple"
              class="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 class="text-lg font-semibold mb-3 text-center leading-snug">
              {{ salamMessage.judul }}
            </h3>
            <p class="text-sm text-gray-700 leading-relaxed mb-4 text-justify">
              {{ salamMessage.message }}
            </p>
            <p v-if="salamMessage.penutup" class="text-sm text-gray-600 leading-relaxed mb-4 text-justify italic">
              {{ salamMessage.penutup }}
            </p>
            <div class="text-center text-sm text-gray-500 italic">
              {{ salamMessage.hormat }}
            </div>
            <div class="text-center font-semibold text-base mt-1">
              {{ salamMessage.signature }}
            </div>
          </div>
        </template>
      </UModal>

    </div>

    <!-- ══ OPENING SCREEN ══ -->
    <div
      v-if="!isOpen"
      class="fixed inset-0 bg-gray-900/10 backdrop-blur z-10 flex flex-col items-center justify-center"
    >
      <div class="board-cream">
        <div class="text-center mb-4">
          <div style="color: #5a3b2e !important">{{ openingData.kepadaYth }}</div>
          <div style="color: #3d2418 !important; font-weight: 700">
            {{ openingData.namaTamu }}
          </div>
        </div>
        <UButton @click="isOpen = !isOpen" size="xl" class="btn-3d">
          {{ openingData.btnText }}
        </UButton>
      </div>
    </div>
  </section>
</template>

<style scoped>
.scane {
  height: min(100dvh, 100vw * 16 / 9);
  aspect-ratio: 4 / 5;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-size: cover;
}

.drawer {
  height: min(100dvh, 100vw * 16 / 9);
  aspect-ratio: 9 / 16;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-size: cover;
}

@keyframes zoomPulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
}

.light-on .glow {
  filter: drop-shadow(0 0 10px rgb(0, 238, 255));
}

.glow:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 5px rgb(0, 238, 255)) drop-shadow(0 0 5px rgb(0, 238, 255));
}

.zoom-in-out {
  animation: zoomPulse 1.8s ease-in-out infinite;
}

.light {
  top: 5%;
}

.btn-3d {
  padding: 10px 20px;
  font-size: 15px;
  font-weight: 900;
  color: #fff;
  background: linear-gradient(to bottom, #a855f7, #7c3aed, #5b21b6);
  border: 2px solid #7c3aed;
  border-radius: 18px;
  cursor: pointer;
  text-transform: uppercase;
  box-shadow:
    0 10px 0 #5b21b6,
    0 18px 30px rgba(0, 0, 0, 0.35);
  transition: all 0.15s ease;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.btn-3d:active {
  transform: translateY(6px);
  box-shadow:
    0 4px 0 #5b21b6,
    0 8px 16px rgba(0, 0, 0, 0.35);
}

.btn-3d:hover {
  transform: translateY(-2px);
  background: linear-gradient(to bottom, #c084fc, #a855f7, #6d28d9);
  box-shadow:
    0 14px 0 #5b21b6,
    0 26px 40px rgba(0, 0, 0, 0.45);
  filter: brightness(1.1);
}

.board-cream {
  padding: 28px 24px;
  border-radius: 18px;
  background: linear-gradient(to bottom, #fff6e5, #f5e7cf);
  border: 3px solid #7a4a2e;
  box-shadow:
    inset 0 2px 0 rgba(255, 255, 255, 0.7),
    inset 0 -4px 0 rgba(122, 74, 46, 0.25),
    0 10px 0 #5c3a25,
    0 18px 30px rgba(0, 0, 0, 0.35);
  text-align: center;
}

.board-cream .sub {
  font-size: 13px;
  color: #6b4b35;
}

.board-cream .name {
  font-size: 18px;
  font-weight: 800;
  margin-top: 6px;
  color: #4a2f1e;
  text-shadow: 0 1px 0 rgba(0, 0, 0, 0.6);
}
</style>