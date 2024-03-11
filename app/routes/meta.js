// all this file holds is the path to the templates and their default values for each routes

export const routeMeta = {
  login: {
    template: "pages/login.html",
    meta: {
      title: "Login",
    },
  },
  forgotPassword: {
    template: "pages/forgot-password.html",
    meta: {
      title: "Forgot password?",
    },
  },
  home: {
    template: "pages/home.html",
    meta: {
      title: "Home",
    },
  },
  resetPassword: {
    template: "pages/reset-password.html",
    meta: {
      title: "Reset password",
    },
  },
  profile: {
    template: "pages/profile.html",
    meta: {
      title: "My profile",
    },
  },
  // -- senders
  adminSendersHome: {
    template: "pages/admin-senders-home.html",
    meta: {
      title: "Senders",
    },
  },
  adminSendersNew: {
    template: "pages/admin-senders-new.html",
    meta: {
      title: "New sender",
    },
  },
  adminSendersEdit: {
    template: "pages/admin-senders-edit.html",
    meta: {
      title: "Edit sender",
    },
  },

  // -- patients
  adminPatientsHome: {
    template: "pages/admin-patients-home.html",
    meta: {
      title: "Patients",
    },
  },
  adminPatientsNew: {
    template: "pages/admin-patients-new.html",
    meta: {
      title: "New patient",
    },
  },
  adminPatientsEdit: {
    template: "pages/admin-patients-edit.html",
    meta: {
      title: "Edit patient",
    },
  },

  // -- messages
  adminMessagesHome: {
    template: "pages/admin-messages-home.html",
    meta: {
      title: "Messages",
    },
  },
  adminMessagesNew: {
    template: "pages/admin-messages-new.html",
    meta: {
      title: "New message",
    },
  },

  // -- home for senders
  sendersHome: {
    template: "pages/sender-home.html",
    meta: {
      title: "Send message",
    },
  },
};
