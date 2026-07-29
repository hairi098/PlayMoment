<template>
  <Transition name="app-loading">
    <div v-if="show" class="app-loading-overlay">
      <div class="app-loading-box">
        <img
          src="/playmoment/logo-teal.png"
          alt="PlayMoment"
          class="app-loading-logo"
          :class="{ 'app-loading-logo--pulse': true }"
        />
        <div class="app-loading-bar-wrap">
          <div class="app-loading-bar"></div>
        </div>
        <p v-if="text" class="app-loading-text">{{ text }}</p>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  text: { type: String, default: "" },
});
</script>

<style scoped>
.app-loading-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.app-loading-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.app-loading-logo {
  width: 140px;
  height: auto;
  object-fit: contain;
}

.app-loading-logo--pulse {
  animation: pm-pulse 1.6s ease-in-out infinite;
}

@keyframes pm-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.65; transform: scale(0.96); }
}

.app-loading-bar-wrap {
  width: 140px;
  height: 3px;
  background: #e2f4f2;
  border-radius: 99px;
  overflow: hidden;
}

.app-loading-bar {
  height: 100%;
  width: 40%;
  background: linear-gradient(90deg, #7ecec4, #2a9d8f);
  border-radius: 99px;
  animation: pm-slide 1.2s ease-in-out infinite;
}

@keyframes pm-slide {
  0%   { transform: translateX(-100%); }
  100% { transform: translateX(350%); }
}

.app-loading-text {
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  font-family: "Nunito", "Segoe UI", sans-serif;
  letter-spacing: 0.3px;
}

/* Transition masuk/keluar */
.app-loading-enter-active {
  transition: opacity 0.2s ease;
}
.app-loading-leave-active {
  transition: opacity 0.35s ease;
}
.app-loading-enter-from,
.app-loading-leave-to {
  opacity: 0;
}
</style>
