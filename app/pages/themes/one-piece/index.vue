<script setup lang="ts">
import { ref } from "vue";
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

const galleries = ref([
  {
    image_url: "https://picsum.photos/seed/picsum/300/200",
  },
  {
    image_url: "https://picsum.photos/seed/wedding/200/300",
  },
  {
    image_url: "https://picsum.photos/seed/wood/300/200",
  },
  {
    image_url: "https://picsum.photos/seed/beach/200/200",
  },
  {
    image_url: "https://picsum.photos/seed/jungle/400/200",
  },
  {
    image_url: "https://picsum.photos/seed/tree/300/400",
  },
  {
    image_url: "https://picsum.photos/seed/love/300/200",
  },
]);

const gifts = ref([
  {
    image_url: "https://picsum.photos/seed/love/300/200",
    bank: "BCA",
    account_number: "12343434354",
    account_name: "Abu Bakar Halid",
  },
  {
    image_url: "https://picsum.photos/seed/love/300/200",
    bank: "Mandiri",
    account_number: "081234567890",
    account_name: "Abu Bakar Halid",
  },
]);

const LoveStorys = ref([
  {
    image_url: "https://picsum.photos/seed/love/300/200",
    title: "Pertemuan Pertama",
    description: "Kami bertemu di sebuah kafe kecil di pinggir kota.",
    date: "2020-01-15",
  },
  {
    image_url: "https://picsum.photos/seed/picsum/300/200",
    title: "Kencan Pertama",
    description:
      "Kencan pertama kami di taman bunga yang indah, penuh warna dan tawa.",
    date: "2020-02-20",
  },
  {
    image_url: "https://picsum.photos/seed/wood/300/200",
    title: "Engangement",
    description:
      "Kencan pertama kami di taman bunga yang indah, penuh warna dan tawa.",
    date: "2020-02-20",
  },
  {
    image_url: "https://picsum.photos/seed/jungle/400/200",
    title: "Caremony",
    description:
      "Kencan pertama kami di taman bunga yang indah, penuh warna dan tawa.",
    date: "2020-02-20",
  },
]);

const profiles = ref([
  {
    image_url: "https://picsum.photos/seed/tree/300/400",
    name: "Adam",
    bio: "Putra dari Abu dan Hawa",
    instagram: "@adam123",
  },
  {
    image_url: "https://picsum.photos/seed/tree/300/400",
    name: "Hawa",
    bio: "Putri dari Abu dan Hawa",
    instagram: "@hawa123",
  },
]);

const events = ref([
  {
    name: "Akad Nikah",
    date: "Minggu, 25 Desember 2024",
    time: "Pukul: 10:00 WITA - Selesai",
    location: "Masjid Agung Kota",
    address: "Jl. Merdeka No.123, Kota",
  },
  {
    name: "Resepsi",
    date: "Minggu, 25 Desember 2024",
    time: "Pukul: 12:00 WITA - Selesai",
    location: "Gedung Serbaguna",
    address: "Jl. Sudirman No.456, Kota",
  },
]);

const dresscode = ref({
  theme: "Elegant Garden",
  colors: ["Sage Green", "Dusty Rose", "Cream"],
  description:
    "Kami mengundang Anda untuk mengenakan pakaian dengan nuansa taman yang elegan. Hindari warna putih dan broken white.",
  image_url: "https://picsum.photos/seed/dresscode/400/300",
});

const mapLocation = ref({
  venue: "Gedung Serbaguna",
  address: "Jl. Sudirman No.456, Kota",
  google_maps_url: "https://maps.google.com/?q=-6.200000,106.816666",
  embed_url:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.666!2d106.816666!3d-6.200000!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTInMDAuMCJTIDEwNsKwNDknMDAuMCJF!5e0!3m2!1sen!2sid!4v1234567890",
  latitude: -6.2,
  longitude: 106.816666,
});

const salamMessage = ref({
  title: "Salam Pernikahan",
  message:
    "Assalamu'alaikum Warahmatullahi Wabarakatuh. Dengan memohon rahmat dan ridho Allah SWT, kami bermaksud mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami. Merupakan suatu kehormatan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu.",
  signature: "Kami yang berbahagia,\nAdam & Hawa",
  image_url: "https://picsum.photos/seed/salam/400/300",
});

// 0 = Tidak Hadir. 1 =Hadir, 2 = Mungkin hadir
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

const attendancestatus = {
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

const handleRsvp = () => {
  try {
    guests.value.unshift({ ...newGuest.value });
    newGuest.value = {
      name: null,
      phone: null,
      comment: null,
      attendance: 1,
    };
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

      <!-- CLICKABLE -->
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

      <!-- END CLICKABLE -->

      <!-- MODAL GALLERY -->
      <UModal
        v-model:open="modalGallery"
        title="Gallery"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <div class="columns-2 gap-2 space-y-2">
            <img
              v-for="(img, i) in galleries"
              :src="img.image_url"
              alt="image"
              class="rounded-md w-full break-inside-avoid"
              :key="i"
            />
          </div>
        </template>
      </UModal>

      <!-- MODAL PROFILE -->
      <UModal
        v-model:open="modalProfile"
        title="Profile"
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
                alt="foto"
                class="h-20 w-20 rounded-full object-cover mb-2 justify-center mx-auto"
              />
              <div>{{ profile.name }}</div>

              <div class="text-2xl">{{ profile.bio }}</div>
              <div class="mt-4">
                <a
                  :href="`https://instagram.com/${profile.instagram}`"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-red-700 px-3 py-1 rounded-full text-white"
                  >{{ profile.instagram }}</a
                >
              </div>
            </div>
          </div>
        </template>
      </UModal>

      <!-- MODAL EVENT -->
      <UModal
        v-model:open="modalEvent"
        title="Event"
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
              <!-- Judul Event -->
              <div class="text-center mb-3">
                <h3 class="text-lg font-semibold tracking-wide">
                  {{ event.name }}
                </h3>
                <div class="w-12 h-0.5 bg-gray-300 mx-auto mt-2"></div>
              </div>

              <!-- Detail -->
              <div class="space-y-2 text-sm text-gray-700">
                <div class="flex items-center justify-center gap-2">
                  {{ event.date }}
                </div>

                <div class="flex items-center justify-center gap-2">
                  {{ event.time }}
                </div>

                <div class="flex items-center justify-center gap-2 font-medium">
                  {{ event.location }}
                </div>

                <div class="text-center text-sm text-gray-500 px-4">
                  {{ event.address }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </UModal>

      <!-- MODAL LOVE STORY -->
      <UModal
        v-model:open="modalLoveStory"
        title="Love Story"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <div class="space-y-3">
            <div
              v-for="(lovestorys, i) in LoveStorys"
              :key="i"
              class="bg-white text-black rounded-lg p-3 flex gap-3 items-start"
            >
              <!-- FOTO -->
              <img
                :src="lovestorys.image_url"
                alt="foto-mempelai"
                class="w-16 h-16 mt-2 rounded-lg object-cover flex-shrink-0"
              />

              <!-- TEXT -->
              <div class="flex-1">
                <div class="font-semibold">
                  {{ lovestorys.title }}
                </div>

                <div class="italic text-sm text-gray-600">
                  {{ lovestorys.description }}
                </div>

                <div class="text-xs text-gray-500 mt-1">
                  {{ lovestorys.date }}
                </div>
              </div>
            </div>
          </div>
        </template>
      </UModal>

      <!-- MODAL RSVP -->
      <UModal
        v-model:open="modalRsvp"
        title="RSVP"
        :ui="{ overlay: 'bg-gray-900/70' }"
        :close="{
          color: 'primary',
          variant: 'outline',
          class: 'rounded-full',
        }"
      >
        <template #body>
          <form @submit.prevent="handleRsvp" class="space-y-4">
            <UFormField label="Nama" class="w-full">
              <UInput v-model="newGuest.name" required class="w-full"></UInput>
            </UFormField>
            <UFormField label="Telepon" class="w-full">
              <UInput v-model="newGuest.phone" required class="w-full"></UInput>
            </UFormField>
            <UFormField label="Kehadiran" class="w-full">
              <USelect
                v-model="newGuest.attendance"
                required
                class="w-full"
                :items="attendanceStatus"
              />
            </UFormField>
            <UFormField label="Komentar" class="w-full">
              <UTextarea
                v-model="newGuest.comment"
                required
                class="w-full mb-4"
              ></UTextarea>
            </UFormField>
            <UButton type="submit" class="w-full justify-center mb-4"
              >Kirim RSVP</UButton
            >
          </form>
          <div class="space-y-4 mb-4">
            <div v-for="(guest, index) in guests" :key="index">
              <div
                class="bg-white text-sm border border-white text-black rounded-lg p-4"
              >
                <div class="">
                  {{ guest.name
                  }}<span
                    class="px-2 text-xs bg-gray-300 text-gray-600 rounded-full ml-2"
                    :class="{
                      'bg-green-200 text-green-800': guest.attendance === 1,
                      'bg-yellow-200 text-yellow-800': guest.attendance === 2,
                      'bg-red-200 text-red-800': guest.attendance === 0,
                    }"
                    >{{ attendancestatus[guest.attendance] }}</span
                  >
                </div>
                <div class="text-black">{{ guest.comment }}</div>
              </div>
            </div>
          </div>
        </template>
      </UModal>

      <!-- MODAL GIFT -->
      <UModal
        v-model:open="modalGift"
        title="Amplop Digital"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <div class="space-y-3">
            <div
              v-for="(gift, i) in gifts"
              :key="i"
              class="bg-white text-black rounded-lg p-4"
            >
              <img
                :src="gift.image_url"
                alt="bank-logo"
                class="w-full h-32 object-cover rounded-md mb-3"
              />
              <div class="space-y-2">
                <div class="font-semibold text-lg">{{ gift.bank }}</div>
                <div class="text-sm text-gray-600">
                  <span class="font-medium">Nama:</span> {{ gift.account_name }}
                </div>
                <div
                  class="flex items-center justify-between bg-gray-100 p-2 rounded"
                >
                  <span class="font-mono text-sm">{{
                    gift.account_number
                  }}</span>
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

      <!-- MODAL DRESSCODE -->
      <UModal
        v-model:open="modalDresscode"
        title="Dress Code"
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
              <div class="flex gap-2">
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

      <!-- MODAL MAPS -->
      <UModal
        v-model:open="modalMaps"
        title="Lokasi Acara"
        class="max-w-md"
        :ui="{ overlay: 'bg-gray-900/70' }"
      >
        <template #body>
          <div class="bg-white text-black rounded-lg p-4">
            <div class="mb-4">
              <h3 class="font-semibold text-lg mb-2">
                {{ mapLocation.venue }}
              </h3>
              <p class="text-sm text-gray-600">{{ mapLocation.address }}</p>
            </div>

            <div class="mb-4 aspect-video rounded-lg overflow-hidden">
              <!-- <iframe
                :src="mapLocation.embed_url"
                width="100%"
                height="100%"
                style="border:0;"
                allowfullscreen=""
                loading="lazy"
                referrerpolicy="no-referrer-when-downgrade"
              ></iframe> -->
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
              class="block w-full text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Buka di Google Maps
            </a>
          </div>
        </template>
      </UModal>

      <!-- MODAL SALAM -->
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
              alt="salam"
              class="w-full h-48 object-cover rounded-md mb-4"
            />
            <h3 class="text-xl font-semibold mb-4 text-center">
              {{ salamMessage.title }}
            </h3>
            <p class="text-sm text-gray-700 leading-relaxed mb-6 text-justify">
              {{ salamMessage.message }}
            </p>
            <div class="text-center italic text-gray-600 whitespace-pre-line">
              {{ salamMessage.signature }}
            </div>
          </div>
        </template>
      </UModal>
    </div>

    <!-- OPENING SCREEN (uncomment untuk mengaktifkan) -->
    <div
      v-if="!isOpen"
      class="fixed inset-0 bg-gray-900/10 backdrop-blur z-10 flex flex-col items-center justify-center"
    >
      <div class="board-cream">
        <div class="text-center mb-4">
          <div style="color: #5a3b2e !important">Kepada Yth</div>
          <div style="color: #3d2418 !important; font-weight: 700">
            Nama Tamu Undangan
          </div>
        </div>

        <UButton @click="isOpen = !isOpen" size="xl" class="btn-3d">
          ▶ Play Invitation
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
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.light-on .glow {
  filter: drop-shadow(0 0 10px rgb(0, 238, 255));
}

.glow:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 5px rgb(0, 238, 255))
    drop-shadow(0 0 5px rgb(0, 238, 255));
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

/* text */
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
