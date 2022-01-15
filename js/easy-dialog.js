window.lodash = _.noConflict();
window.$ = jQuery

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

var isBuild = false;
var isChange = false;
var user_id ="";
var browser = "";
var ip = "";

if(navigator.userAgent.indexOf("Chrome") != -1 ) browser = "chrome";
else if(navigator.userAgent.indexOf("Firefox") != -1 ) browser = "firefox";
else if (navigator.userAgent.indexOf("MSIE") != -1 ) browser = "msie";
else if (navigator.userAgent.indexOf("Edge") != -1 ) browser = "edge";
else if (navigator.userAgent.indexOf("Safari") != -1 ) browser = "safari";
else if (navigator.userAgent.indexOf("Opera") != -1 ) browser = "opera";
else browser = "other";

jQuery.getJSON("https://api.ipify.org?format=json", function(data) {
  if(!data.ip){
      alert("we couldn't retrieve your IP properly. Please acknowledge that this might cause issues.")
  }else{
      let str = data.ip.replace(/\./g, "");
      ip = str;
  }
});

var url = 'https://easydialog.org/wp-admin/admin-ajax.php'

const store = new Vuex.Store({
    state: {
        boxes: [],
        docs: [],
        scripts: [],
        activeCases: {},
        newStepPosition: 0,
        ad:{},
    },
    getters: {
        cards(state, getters){
          let cards = [];
          if(state.boxes.length){
            let _loop = lodash.cloneDeep(getters.getBox(1));
            while(true){
              if(cards.map(i => i.id).includes(_loop.id)) break;
              const activeCaseIndex = state.activeCases[_loop.id] ? state.activeCases[_loop.id] : 0;
              let next = _loop.cases[activeCaseIndex].next
              _loop.cases[activeCaseIndex]['active'] = true
              _loop.next = next
              let doc = state.docs.find( i => i.caseid == _loop.id)
              if(doc){
                _loop.doc = doc.data
              }
              cards.push(_loop)
              if(!next || !getters.getBox(next)) break;
              _loop = lodash.cloneDeep(getters.getBox(next))
            }
          }
          return cards
        },
        getBox(state){
            return (id) => state.boxes.find(i => i.id == id)
        },
        getCard(state, getters){
            return (id) => getters.cards.find(i => i.id == id)
        },
        getActiveCaseIndexOfBox(state){
          return (id) =>{
            return state.activeCases[id] ? state.activeCases[id] : 0
          }
        },
        getActiveCaseOfBox(state, getters){
          return (id) => {
            return getters.getBox(id).cases[getters.getActiveCaseIndexOfBox(id)]
          }
        },
        getLastCard(state, getters){
          let cards = getters.cards;
          return cards.length ? cards[cards.length - 1] : null;
        },
        getNewBoxId(state){
          return state.boxes.length ? Math.max(...state.boxes.map(i => i.id)) + 1 : 1
        },
        getPrevCard(state, getters){
          return ( id ) => {
            if(id > 1){
              let cardIndex = getters.cards.findIndex(card => card.id == id) - 1;
              return getters.cards[cardIndex]
            }else if(id == 1){
              return null;
            }else{
              return getters.getLastCard;
            }
          }
        },
        getOtherCasesOfCard(state, getters){
          return ( card ) => {
            let cases = prevCard.cases.filter(i => !i.active)
            return getters.getBox(prevCard.id).cases[caseId]
          }
        },
        getBoxIndexById(state, getters){
          return ( boxId ) => {
            return state.boxes.findIndex(i => i.id == boxId)
          }
        },
        getNextCardId(state, getters){
          return id => { return getters.getCard(id).next }
        },
        isExistPrevBox(state, getters){
          return (id) => {
            let cnt = 0
            state.boxes.forEach( box => {
              box.cases.forEach(item => {
                (item.next == id) && cnt++
              })
            })
            return cnt;
          }
        },
        mains(state){
          return Object.keys(state.ad);
        },
        subs(state){
          return (main) => {
            return state.ad[main]
          }
        }
    },
    actions: {
        addCaseToBox({state, commit, getters, dispatch}, {id, content}){
            let box = getters.getBox(id)
            let caseIndex = box.cases.length
            commit('setActiveCase', {boxId: id, caseIndex: box.cases.length})
            commit('pushCaseToBox', {box, content})
        },
        removeCaseFromBox({state, commit, getters, dispatch}, {boxId, caseIndex}){
          let box = getters.getBox(boxId)
          let next = box.cases[caseIndex].next
          commit('deleteCaseFromBox', {box, caseIndex})
          dispatch('removeFlow', next)
          if(caseIndex < state.activeCases[boxId]){
            commit('setActiveCase', {
              boxId,
              caseIndex:state.activeCases[boxId] - 1
            })
          }else if(caseIndex == state.activeCases[boxId]){
            commit('setActiveCase', {
              boxId,
              caseIndex: 0
            })
          }
        },
        removeOnlyBox({state, commit, getters, dispatch}, {boxId}){
          const boxIndex = getters.getBoxIndexById(boxId)
          if(boxId - 1){
            commit('setNextOfCase', {
              caseItem: getters.getActiveCaseOfBox(getters.getPrevCard(boxId).id),
              next: getters.getNextCardId(boxId)
            })
          }else{
            if(getters.getNextCardId(boxId)){
              commit('changeBoxId', {
                box: getters.getBox(getters.getNextCardId(boxId)),
                id: 1
              })
            }
          }
          commit('deleteBox', {boxIndex})
        },
        removeBoxAndFlow({state, commit, getters, dispatch}, {boxId}){
          if(boxId - 1){
            commit('setNextOfCase', {
              caseItem: getters.getActiveCaseOfBox(getters.getPrevCard(boxId).id),
              next: 0
            })
            dispatch('removeFlow', boxId)
          }else{
            commit('initBoxes')
          }
        },
        removeFlow({state, commit, getters, dispatch}, boxId){
          if(Number(boxId) && !getters.isExistPrevBox(boxId)){
            const boxIndex = getters.getBoxIndexById(boxId)
            const list = getters.getBox(boxId).cases.map( i => i.next)
            commit('deleteBox', {boxIndex})
            list.forEach(id => dispatch('removeFlow', id))
          }
        },
        updateCase({state, commit, getters, dispatch}, payload){
          caseItem = getters.getBox(payload['box-id']).cases[payload['case-id']]
          commit('changeCase', {caseItem, content: payload['content']})
        },
        addNewBox({state, commit, getters, dispatch}, {action, val, select = false}){
          let id = getters.getNewBoxId
          content = (action == 'ad') ? [val, val] : val
          if(state.newStepPosition == 1){
            commit('pushBox', {
              id: 1,
              action,
              cases: [{ content, next: id}]
            })
            commit('changeBoxId', {box: getters.getBox(1), id})
          }else{
            let next = 0;
            if(id - 1){
              let card = getters.getPrevCard(state.newStepPosition) ;
              commit('setNextOfCase', {
                caseItem: getters.getActiveCaseOfBox(card.id),
                next: id
              })
              next = card.next
            }
            commit('pushBox', {
              id,
              action,
              cases: [{ content, next}]
            })

          }
          if(action == 'ad' && !select){
            commit('pushAdMain', val)
          }
          commit('setNewStepPosition', 0)
        },
        setNewStepPosition({state, commit, getters, dispatch}, id){
          commit('setNewStepPosition', id);
        },
        setActiveCase({commit}, payload){
          commit('setActiveCase', payload)
        },
        setNextOfCase({commit, getters}, {boxId, next}){
          let caseItem = getters.getActiveCaseOfBox(boxId)
          commit('setNextOfCase', {caseItem, next})
        },
        setImageOfBox({state, commit, getters}, {boxId, data, doc_name}){
          let doc = state.docs.find( i => i.caseid == boxId)
          if(doc){
            commit('changeDoc', {doc, data, doc_name})
          }else{
            commit('pushDoc', {boxId, data, doc_name})
          }
        },
        setScriptOfBox({state, commit, getters}, {boxId, data, script_name}){
          let script = state.scripts.find( i => i.caseid == boxId)
          if(script){
            commit('changeScript', {script, data, script_name})
          }else{
            commit('pushScript', {boxId, data, script_name})
          }
        },

        addAdSubToBox({state, commit, getters, dispatch}, {boxId, main, sub}){
          commit('pushSubToMain', {main, sub});
          let box = getters.getBox(boxId)
          let caseItem = box.cases[0]
          if(caseItem.content[1] == main){
            commit('changeCase', {caseItem, content:[main, sub]})
          }else{
            dispatch('addCaseToBox', {id: boxId, content: [main, sub]})
          }
        },
        changeAdMainOfBox({state, commit, getters, dispatch}, {boxId, next, val}){
          let nexts = getters.getBox(boxId).cases.map(i => i.next)
          nexts.splice(state.activeCases[boxId], 1)
          let box = getters.getBox(boxId)
          commit('setActiveCase', {boxId, caseIndex:0})
          commit('changeCasesOfBox', {
            box,
            cases:[{content: [val, val], next}]
          })
          commit('pushAdMain', val)

          for(i in nexts){
            dispatch('removeFlow', nexts[i])
          }
        },
        activeAdMainOfBox({state, commit, getters, dispatch}, {boxId, next, val}){
          let nexts = getters.getBox(boxId).cases.map(i => i.next)
          nexts.splice(state.activeCases[boxId], 1)
          let box = getters.getBox(boxId)
          commit('setActiveCase', {boxId, caseIndex:0})
          commit('changeCasesOfBox', {
            box,
            cases:[{content: [val, val], next}]
          })
          for(i in nexts){
            dispatch('removeFlow', nexts[i])
          }
        }
    },
    mutations: {
        initBoxes(state){
          state.boxes = []
        },
        setCards(state, cards){
            state.cards = cards
        },
        pushCaseToBox(state, {box, content}){
            box.cases.push({
              content,
              next: 0
            })
        },
        changeCase(state, {caseItem, content}){
            caseItem.content = content
        },
        deleteCaseFromBox(state, {box, caseIndex}){
            box.cases.splice(caseIndex, 1);
        },
        pushBox(state, newBox){
            state.boxes.push(newBox);
        },
        setNextOfCase(state, {caseItem, next}){
          caseItem['next'] = next
        },
        setNewStepPosition(state, id){
          state.newStepPosition = id
        },
        changeBoxId(state, {box, id}){
          box.id = id
        },
        deleteBox(state, {boxIndex}){
          state.boxes.splice(boxIndex, 1)
        },
        setActiveCase(state, {boxId, caseIndex}){
          let oldActiveCases = lodash.cloneDeep(state.activeCases)
          oldActiveCases[boxId] = caseIndex
          state.activeCases = oldActiveCases
        },
        changeDoc(state, {doc, data, doc_name}){
          doc.data = data;
          doc.doc_name = doc_name
        },
        pushDoc(state, {boxId, data, doc_name}){
          state.docs.push({
            'caseid': boxId,
            data,
            doc_name
          })
        },
        changeScript(state, {script, data, script_name}){
          script.data = data;
          script.script_name = script_name
        },
        pushScript(state, {boxId, data, script_name}){
          state.scripts.push({
            'caseid': boxId,
            data,
            script_name
          })
        },
        pushAdMain(state, val){
          let obj = {...(state.ad)}
          obj[val] = []
          state.ad = {...obj}
        },
        pushSubToMain(state, {main, sub}){
          let obj = {...(state.ad)}
          obj[main].push(sub)
          state.ad = {...obj}
        },
        changeCasesOfBox(state, {box, cases}){
          box.cases = cases
        }
    }
});

Vue.component('new-box', {
    template: '#new-box-template',
    computed: {
      mains(){
        return this.$store.getters.mains
      },
      subs(){
        return (main) => this.$store.getters.subs(main)
      }
    },
    data(){
      return {
        renderKey: 0
      }
    },
    methods: {
      addNewBox(action, e){
        val = e.target.value
        this.$store.dispatch('addNewBox', {action, val})
        this.renderKey++
      },
      selectMain(action, val){
        this.$store.dispatch('addNewBox', {action, val, select:true})
        this.renderKey++
      }
    }
})

Vue.component('card-hs', {
    props: ['card'],
    template: '#card-hs-template',
    data(){
      return {
        next: null
      }
    },
    methods: {
        addCaseToCard(id, event){
            this.$store.dispatch('addCaseToBox',{id, content:event.target.value})
            event.target.value = ''
        },
        setNext(){
          jQuery('#nextStepModal').modal('hide')
          self = this
          jQuery('#nextStepModal').on('hidden.bs.modal', function (e) {
            self.$store.dispatch('setNextOfCase', {
              boxId: self.card.id,
              next: self.next
            })
          })
        }
    }
})

Vue.component('card-as', {
    props: ['card', 'card-idx'],
    template: '#card-as-template',
    data(){
      return {
        next: null
      }
    },
    methods: {
      setNext(){
        jQuery('#nextStepModal').modal('hide')
        self = this
        jQuery('#nextStepModal').on('hidden.bs.modal', function (e) {
          self.$store.dispatch('setNextOfCase', {
            boxId: self.card.id,
            next: self.next
          })
        })
      },

    }
})

Vue.component('card-ad', {
    props: ['card', 'card-idx'],
    template: '#card-ad-template',
    data(){
      return {
        next: null,
        renderKey: 0
      }
    },
    computed: {
      activeContent(){
        return this.card.cases.find(i => i.active).content
      },
      mains(){
        return this.$store.getters.mains
      },
      subs(){
        return (main) => this.$store.getters.subs(main)
      },
      caseSubs(){
        return this.card.cases.map(i => i.content[1])
      }
    },
    methods: {
      changeAdMain(e){
        if(confirm('Do you want to change the name of the main library?')){
          val = e.target.value
          this.$store.dispatch('changeAdMainOfBox', {boxId: this.card.id, next: this.card.next, val})
          this.renderKey++
        }
      },
      activeAdMain(main){
        if(confirm('Do you want to change the name of the main library?')){
          this.$store.dispatch('activeAdMainOfBox', {boxId: this.card.id, next: this.card.next, val:main})
          this.renderKey++
        }
      },
      addAdSub(e){
        this.$store.dispatch('addAdSubToBox', {
          boxId: this.card.id,
          main: this.activeContent[0],
          sub:  e.target.value
        })
        this.renderKey++
      },
      deleteBox(){
        swal("what should I delete?", {
          buttons: {
            cancel: "Cancel",
            all: {
              text: "This step and dependent flows all",
              value: "all",
            },
            one: {
              text: "Only this step",
              value: "one"
            }
          },
        })
        .then((value) => {
          switch (value) {
            case "one":
              this.$store.dispatch('removeOnlyBox', {
                boxId: this.card.id
              })
              break;
            case "all":
              this.$store.dispatch('removeBoxAndFlow', {
                boxId: this.card.id
              })
              break;

            default:
              console.log('canceled')
          }
        });
      },
      deleteCase(sub){
        if(this.caseSubs.length - 1){
          swal("This will deletes this step and the connected flow. Proceed?", {
            buttons: ['Cancel', true]
          })
          .then((val) => {
            if(val){
              let caseIndex = this.caseSubs.indexOf(sub)
              this.$store.dispatch('removeCaseFromBox', {
                boxId: this.card.id,
                caseIndex: caseIndex
              })
            }
          })
        }else{
          this.deleteBox()
        }
      },
      activateOrPushCase(sub){
        let caseIndex = this.caseSubs.indexOf(sub)
        if(caseIndex + 1){
          this.$store.dispatch('setActiveCase',{
            boxId: this.card.id,
            caseIndex: caseIndex
          })
        }else{
          this.$store.dispatch('addCaseToBox', {
            id: this.card.id,
            content: [this.activeContent[0], sub]
          })
        }
      },
      setNext(){
        jQuery('#nextStepModal').modal('hide')
        self = this
        jQuery('#nextStepModal').on('hidden.bs.modal', function (e) {
          self.$store.dispatch('setNextOfCase', {
            boxId: self.card.id,
            next: self.next
          })
        })
      }
    }
})

Vue.component('the-card', {
    template: '#the-card-template'
})

Vue.component('the-card-button', {
    props: ['title'],
    template: '#the-card-button-template'
})

Vue.component('the-card-case', {
    props: ['content', 'active', 'box-id', 'case-id', 'action', 'casesLength'],
    template: '#the-card-case-template',
    data(){
        return {
            clicks: 0,
            timer: null,
            editing: false,
        }
    },
    updated(){
        $('textarea').focus()
    },
    methods: {
        handleClick: function(event){
            this.clicks++
            if(this.clicks === 1){
                var self = this
                this.timer = setTimeout(function(){
                    if(self.action == 'hs'){
                        self.activeCase()
                    }else{
                        console.log('click')
                    }
                    self.clicks = 0
                }, 200)
            }else{
                clearTimeout(this.timer);
                this.editing = true
                this.clicks = 0
            }
        },
        activeCase: function(){
            this.$store.dispatch('setActiveCase',{
              boxId: this.boxId,
              caseIndex: this.caseId
            })
        },
        blurEventHandler: function(){
            this.editing = false
        },
        changeEventHandler: function(e){
          e.preventDefault();
          this.editing = false
          this.$store.dispatch('updateCase', {
            'box-id': this.boxId,
            'case-id': this.caseId,
            'content': e.target.value
          })
        },
        removeEventHandler: function(){
          if(this.casesLength - 1){
            swal("This will deletes this step and the connected flow. Proceed?", {
              buttons: ['Cancel', true]
            })
            .then((val) => {
              if(val){
                this.$store.dispatch('removeCaseFromBox', {
                  boxId: this.boxId,
                  caseIndex: this.caseId
                })
              }
            })
          }else{
            swal("what should I delete?", {
              buttons: {
                cancel: "Cancel",
                all: {
                  text: "This step and dependent flows all",
                  value: "all",
                },
                one: {
                  text: "Only this step",
                  value: "one"
                }
              },
            })
            .then((value) => {
              switch (value) {

                case "one":
                  this.$store.dispatch('removeOnlyBox', {
                    boxId: this.boxId
                  })
                  break;
                case "all":
                  this.$store.dispatch('removeBoxAndFlow', {
                    boxId: this.boxId
                  })
                  break;

                default:
                  console.log('canceled')
              }
            });
          }

        }
    }
})

Vue.component('change-next-btn', {
  props: ['id'],
  template: '#change-next-btn-template',
  methods: {
    clickHandler: function(){
      this.$store.dispatch('setNewStepPosition', this.id)
    }
  }
})

Vue.component('new-step-btn', {
  props: ['id'],
  template: '#new-step-btn-template',
  methods: {
    clickHandler: function(){
      this.$store.dispatch('setNewStepPosition', this.id)
    }
  }
})

Vue.component('new-image-btn', {
  props: ['id'],
  template: '#new-image-btn-template',
  methods: {
    clickHandler: function(e){
      e.currentTarget.previousElementSibling.click()
    },
    updateImage(e){
      console.log('hi')
      if(e.target.files[0].size > 1000000){
          alert('File Size should smaller than 1M')
          return false;
      }

      let filename = e.target.files[0].name

      if(!/^[a-zA-Z0-9-_]+$/.test(filename.split('.')[0])){
        alert('File name is wrong. File name should include only alphabet letters, digits, and underline (_)')
        return false
      }

      const reader = new FileReader();

      reader.onload = (e) => {
          this.$store.dispatch('setImageOfBox', {
            boxId: this.id,
            data: e.target.result,
            doc_name: filename
          })
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }
})

Vue.component('new-script-btn', {
  props: ['id'],
  template: '#new-script-btn-template',
  methods: {
    clickHandler: function(e){
      e.currentTarget.previousElementSibling.click()
    },
    updateImage(e){
      console.log('hi')
      if(e.target.files[0].size > 100000){
          alert('File Size should smaller than 100KB')
          return false;
      }

      let filename = e.target.files[0].name

      if(!/^[a-zA-Z0-9-_]+$/.test(filename.split('.')[0])){
        e.target.value = null
        alert('File name is wrong. File name should include only alphabet letters, digits, and underline (_)')
        return false
      }

      const reader = new FileReader();

      reader.onload = (e) => {
          this.$store.dispatch('setScriptOfBox', {
            boxId: this.id,
            data: e.target.result,
            script_name: filename
          })
      };

      reader.readAsDataURL(event.target.files[0]);
    }
  }
})

const vm = new Vue({
    el: '#easyDialog',
    store,
    data(){
        return {
            loading: false,
            waiting: false,
            next: null,
        }
    },
    computed: {
        boxes(){
            return this.$store.state.boxes
        },
        cards(){
            return this.$store.getters.cards
        },
        newStepPosition(){
          return this.$store.state.newStepPosition
        }
    },

    created: function(){
        this.loading = false
    },

    methods: {
      buildBot(){
        if(browser && ip){
          if(!this.boxes.length){
            alert("Warning: There is no content to build the Bot.")
            return true;
          }
          if(confirm(JSON.stringify(this.boxes))){
            this.waiting = true
            fetch(url, {
              method: 'POST',
              credentials: 'same-origin',
              body: JSON.stringify({
                action:'build_bot_dev',
                param:{
                    data:{
                      boxes: this.boxes,
                      scripts: this.scripts,
                      docs: this.docs,
                      ad: this.ad,
                    },
                    user_id: browser + ip
                }
              })
            })
            .then(res => {
              if(res.ok) this.waiting = false
              throw new Error('Network response was not ok.')
            })
            .catch(err => {
              this.waiting = false
              alert("There was an issue building your Bot. Please click \"Build easyBot\" again to try again.");
              console.log(err)
            })
          }
        }
      },
    }

})
