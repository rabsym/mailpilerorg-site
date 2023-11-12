const viewer = axios.create({ baseURL: location.origin, timeout: 30000 })
const uri = 'https://helper.mailpiler.com/1.php'
const msg_button_default_text = 'Send message'
const msg_button_sending_text = 'MESSAGE IS BEING SENT'
const search_uri = 'https://helper.mailpiler.com/search.php'
const search_index = 'mailpilerorg'

let tt = '' // cf turnstile token

const select = (el, all = false) => {
  el = el.trim()
  if(all) {
    return [...document.querySelectorAll(el)]
  } else {
    return document.querySelector(el)
  }
}

var throttleTimer

const throttle = (callback, time) => {
  if (throttleTimer) return;
  throttleTimer = true;
  setTimeout(() => {
    callback();
    throttleTimer = false;
  }, time)
}

function assert(condition, message) {
  if(!condition) {
    throw new Error(message || "Assertion failed")
  }
}

function get_turnstile_token(token) {
  tt = token
}

function hide_modal(id = '') {
  try {
    let modalId = document.getElementById(id)
    const modal = bootstrap.Modal.getOrCreateInstance(modalId)
    modal.hide()
  } catch(e) {
    log(e)
  }
}

function show_modal(id = '') {
  try {
    let modalId = document.getElementById(id)
    const modal = bootstrap.Modal.getOrCreateInstance(modalId)
    modal.show()
  } catch(e) {
    log(e)
  }
}

const app = Vue.createApp({
  computed: {
    page_id: function() {
      a = window.location.href.split('/')
      s = a.findLast((element) => true)
      return s
    }
  },

  data() {
    return {
      message: {
        multitenancy: 'no'
      },
      mobile_navbar_open: false,
      search_criteria: '',
      search_results: [],
      num_search_results: 0,
      system: {},
      turnstile: {
        sitekey: '0x4AAAAAAAMROBjRw8PPfd7x'
      }
    }
  },

  methods: {
    async init() {
      console.log("[init]")

      //new PureCounter()

      AOS.init({
        duration: 1000,
        easing: "ease-in-out",
        once: true,
        mirror: false
      });

      let response = await viewer.get(uri)
      this.system = response.data

      let preloader = document.getElementById('preloader');
      if(preloader) {
         preloader.remove()
      }
    },

    toggle_back_to_top() {
      throttle(() => {
        console.log("[toggle_back_to_top]")
        let backtotop = select('.back-to-top')

        if(backtotop){
          if(window.scrollY > 100) {
            backtotop.classList.add('active')
          } else {
            backtotop.classList.remove('active')
          }
        }
      }, 1000);
    },

    toggle_mobile_menu() {
      console.log("[toggle_mobile_menu]", this.mobile_navbar_open)
      this.mobile_navbar_open = !this.mobile_navbar_open
    },

    close_mobile_menu() {
      console.log("[close_mobile_menu]")

      if(this.mobile_navbar_open) {
        this.toggle_mobile_menu()
      }
    },

    async send_email() {
      console.log("send_email")
      let b = document.getElementById('msgbtn')
      b.innerText = msg_button_sending_text
      try {
        let formid = document.getElementById("formid").value
        const params = new URLSearchParams({...{token: this.system.token, tt: tt, id: formid, page_id:this.page_id}, ...this.message})
        let response = await viewer.post(uri, params)
        assert(response.data === "OK", response.data)
        this.show_message("Message has been sent!")
        this.message = {multitenancy:'no'}
        tt = ''
      } catch(e) {
        console.log('message send result:', e)
        this.show_message("Failed to send message", e)
      } finally {
        b.innerText = msg_button_default_text
      }
    },

    show_message(title = '', msg = '', small = "Now") {
      let toastTitle = document.getElementById("toast-title")
      let toastSmall = document.getElementById("toast-small")
      let toastMsg = document.getElementById("toast-msg")

      toastTitle.innerHTML = title
      toastSmall.innerHTML = small
      toastMsg.innerHTML = msg

      const toastId = document.getElementById("ToastId")
      if(toastId) {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastId)
        toastBootstrap.show()
      }
    },

    async search() {
      console.log("[search]", this.search_index, this.search_criteria)
      try {
        const params = new URLSearchParams({index: search_index, search: this.search_criteria})
        let response = await viewer.post(search_uri, params)
        assert(response.data.error === '', response.data.error)
        let results = response.data
        this.num_search_results = results.total
        assert(this.num_search_results > 0, "No search results")
        this.search_results = results.data
        show_modal('searchResultsModal')
      } catch(e) {
        this.show_message("Failed to search", e)
      }
    }

  },

  mounted(){
    window.addEventListener("load", () => this.init()),
    window.addEventListener("scroll", () => this.toggle_back_to_top())
  }

})
app.mount('#app')
