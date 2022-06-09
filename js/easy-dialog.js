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
          try{
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
                  _loop.doc = doc
                }
                cards.push(_loop)
                if(!next || !getters.getBox(next)) break;
                _loop = lodash.cloneDeep(getters.getBox(next))
              }
            }
            return cards
          }catch{
            alert('Data Format Error!!!\nSorry, give the refresh the page.')
            location.reload();
            return []
          }

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
        addNewVariant({state, commit, getters, dispatch}, {id, index, val}){
            commit('pushVariantToCase', {id, index, val})
        },
        updateVariant({state, commit, getters, dispatch}, {k1, k2, id, val}){
            // let box = getters.getBox(id)
            commit('updateVariantOfCase', {id, k1, k2, val})
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
          content = null
          if(action == 'hs') content = [val];
          if(action == 'as') content = val;
          if(action == 'ad') content = [val, val];

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
        removeDoc({commit, getters}, {caseid}){
          commit('removeDoc', {caseid})
        },
        setScriptOfBox({state, commit, getters}, {boxId, data, script_name}){
          let script = state.scripts.find( i => i.caseid == boxId)
          if(script){
            commit('changeScript', {script, data, script_name})
          }else{
            commit('pushScript', {boxId, data, script_name})
          }
        },

        loadBot({commit}, data){
            data.docs && commit('setDocs', data.docs)
            data.scripts && commit('setScripts', data.scripts)
            data.ad && commit('setAd', data.ad)
            commit('setBoxes', data.boxes)
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
        },
        changeCasesOfBox({state, getters, commit}, {value, cardId}){
          caseIndex = value.findIndex(i => i.active)
          commit('setActiveCase', {
            boxId: cardId,
            caseIndex
          })
          commit('changeCasesOfBox', {
            value: value.map(i => {
              delete i.active;
              return i
            }),
            box: getters.getBox(cardId)
          })
        },
    },
    mutations: {
        initBoxes(state){
          state.boxes = []
        },
        setBoxes(state, boxes){
          state.boxes = boxes
        },
        setDocs(state, docs){
          state.docs = docs
        },
        setScripts(state, scripts){
          state.scripts = scripts
        },
        setAd(state, ad){
          state.ad = ad
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
        pushVariantToCase(state, {id, index, val}){
          state.boxes.find(i => i.id == id).cases[index].content.push(val)
            Vue.set(state, 'boxes', [...state.boxes])
        },
        updateVariantOfCase(state, {id, k1, k2, val}){
            state.boxes.find(i => i.id == id).cases[k1].content[k2] = val
            Vue.set(state, 'boxes', [...state.boxes])
        },
        changeCase(state, {caseItem, content}){
            caseItem.content = content
        },
        changeCasesOfBox(state, {value, box}){
          box.cases = value
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
        removeDoc(state, {caseid}){
          state.docs = state.docs.filter(doc => doc.caseid != caseid)
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
        changeCasesOfBox(state, {cases, box}){
          box.cases = cases
        }
    }
});

Vue.use(BootstrapVue)

Vue.component('new-box', {
    template: '#new-box-template',
    props: {
      'prevCardAction': {
        type: String,
        default: null
      }
    },
    computed: {
      mains(){
        return this.$store.getters.mains
      },
      subs(){
        return (main) => this.$store.getters.subs(main)
      }
    },
    mounted(){
      $(".inputing")[0].focus()
    },
    updated(){
      $(".inputing")[0].focus()
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
    props: ['card', 'is-insert', 'is-last'],
    template: '#card-hs-template',
    data(){
      return {
        next: '',
        drag: false,
        drawer: {},
        newVariant: ''
      }
    },
    computed: {
      cases: {
        get(){
          return this.card.cases
        },
        set(value){
          this.$store.dispatch('changeCasesOfBox', {
            value,
            cardId: this.card.id
          })
        }
      }
    },
    methods: {
        addCaseToCard(id, event){
            this.$store.dispatch('addCaseToBox',{id, content:[event.target.value]})
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
        },
        removeNext(){
          jQuery('#nextStepModal').modal('hide')
          self = this
          jQuery('#nextStepModal').on('hidden.bs.modal', function (e) {
            self.$store.dispatch('setNextOfCase', {
              boxId: self.card.id,
              next: 0
            })
          })
        },
        onMove({ relatedContext, draggedContext }) {
          const relatedElement = relatedContext.element;
          const draggedElement = draggedContext.element;
          // return (
          //   (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
          // );
        },
        addNewVariant(e, id, index){
          if(e.target.value){
            this.$store.dispatch('addNewVariant',{val:e.target.value, index, id})
            e.target.value = ''
            this.newVariant = ''
          }
        },
        updateVariant(e, id, k1, k2){
          if(e.target.value){
            this.$store.dispatch('updateVariant', {val: e.target.value, id, k1, k2})
          }
        }
    }
})

Vue.component('card-as', {
    props: ['card', 'card-idx', 'is-insert', 'is-last'],
    template: '#card-as-template',
    data(){
      return {
        next: ''
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
      removeNext(){
        jQuery('#nextStepModal').modal('hide')
        self = this
        jQuery('#nextStepModal').on('hidden.bs.modal', function (e) {
          self.$store.dispatch('setNextOfCase', {
            boxId: self.card.id,
            next: 0
          })
        })
      },
      removeDoc(){
        this.$store.dispatch('removeDoc', {
          caseid: this.card.id
        })
      }
    }
})

Vue.component('card-ad', {
    props: ['card', 'card-idx', 'is-insert', 'is-last'],
    template: '#card-ad-template',
    data(){
      return {
        next: '',
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
      },
      removeNext(){
        jQuery('#nextStepModal').modal('hide')
        self = this
        jQuery('#nextStepModal').on('hidden.bs.modal', function (e) {
          self.$store.dispatch('setNextOfCase', {
            boxId: self.card.id,
            next: 0
          })
        })
      },
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
                        console.log('click')
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

        },
        testFunc: function(event){
          event.stopImmediatePropagation()
          console.log('checkingB')
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

Vue.component('remove-step-btn', {
  template: '#remove-step-btn-template',
  methods: {
    clickHandler: function(){
      this.$store.dispatch('setNewStepPosition', 0)
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
      if(e.target.files[0].size > 40000){
          alert('File Size should smaller than 40K')
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
      if(e.target.files[0].size > 40000){
          alert('File Size should smaller than 40KB')
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

      reader.readAsText(event.target.files[0]);
    }
  }
})

const vm = new Vue({
    el: '#easyDialog',
    store,
    data(){
        return {
            isAuthorized: true,
            username: null,
            password: null,
            loading: false,
            waiting: false,
            next: null,
            botKey: '',
            loadingBotId: '',
            savingBotId: '',
            isChanged: false,
            isBuilt: false,
            isSaved: true,
            slotFileName: '',
            slotname: '',
            slot_data: {},
            drawer: true
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

    updated(){
      // this.$nextTick(() => {
      //   this.$refs.inputing.focus()
      // })
    },

    watch: {
      boxes: () => {
        this.isChanged = true
      }
    },

    created: function(){
        this.loading = false
    },

    methods: {
      logIn(){
        this.waiting = true
        // $.ajax({
        //     type: 'POST',
        //     url: url,
        //     xhrFields: { withCredentials: true},
        //     data:{
        //       action:'build_bot_dev',
        //       param:{
        //           data:{
        //             username: this.username,
        //             password: this.password,
        //           },
        //       }
        //     },

        //     dataType: 'json',
        //     success: function(response) {
        //       vm.waiting = false
        //       if(response.success){
        //         this.isAuthorized = true
        //       }
        //     },
        //     error: function(){
        //         vm.waiting = false
        //         alert("There was an issue building your Bot. Please click \"Build easyBot\" again to try again.");
        //     },
        //     timeout: 300000
        // });
        this.waiting = false
        this.isAuthorized = true
      },
      getKey(){
        let timer = setInterval(() => {
          $.ajax({
            type: 'POST',
            url: url,
            xhrFields: { withCredentials: true},
            data:{
              action:'get_bot_key',
              param:{
                "user_id": browser + ip
              }
            },
            dataType: 'json',
            success: function(response) {
              if(response.password){
                vm.botKey = response.password;
                clearInterval(timer);
              }
            },
          });
        }, 30000);

        setTimeout(() => { 
          clearInterval(timer); 
          if(!vm.botKey){
            alert('Bot did not build correctly, please contact info@easydialog.org'); 
          }
        }, 10 * 60 * 1000);
      },
      buildBot(){
        if(browser && ip){
          if(!this.boxes.length){
            alert("Warning: There is no content to build the Bot.")
            return true;
          }
          if(confirm(JSON.stringify(this.boxes))){
            this.waiting = true
            $.ajax({
                type: 'POST',
                url: url,
                xhrFields: { withCredentials: true},
                data:{
                  action: 'build_bot_async',  // 'build_bot_dev'
                  param:{
                    data:{
                      boxes: this.$store.state.boxes,
                      scripts: this.$store.state.scripts,
                      docs: this.$store.state.docs,
                      ad: this.$store.state.ad,
                    },
                    user_id: browser + ip
                  }
                },

                dataType: 'json',
                success: (response) => {
                  vm.waiting = false
                  
                  isBuild = true
                  isChange = false

                  if(!response){
                    this.getKey();
                    alert('Bot is being built in the background. This might take a few minutes.  Once the bot is completed, you can use it using the botkey displayed in the upper left corner of this site')
                  }else if(response.password && response.password.en){
                    vm.botKey = response.password.en; // .de  .fr  .ja
                    if(response.message){
                      alert(response.message)
                    }else{
                      alert("The bot is still being built in the background. You should be able to use in about 1 minute.")
                    }
                  }

                },
                error: function(){
                    vm.waiting = false
                    alert("Building Bots is not possible right now, please try again later");
                    isBuild = true
                    isChange = false
                },
                timeout: 300000
            });
          }
        }
      },
      loadBot(){
        if(!this.loadingBotId) {
          alert('Input name to load the Bot')
          return
        }
        // e.preventDefault();

        if(!this.isChanged || confirm("The current bot hasn’t been built.\n Shall I still load a new bot?")){
            if(this.isSaved){
                jQuery.ajax({
                    type: 'POST',
                    url: url,
                    xhrFields: {
                        withCredentials: true
                    },

                    data:{
                        action:'load_bot_dev',
                        param:{
                            user_id: browser + ip,
                            bot_id: this.loadingBotId
                        }
                    },
                    dataType:'json',
                    beforeSend: function() {
                        vm.waiting = true
                    },
                    success: (res) => {
                        vm.waiting  = false
                        if(res.message){
                          alert(res.message);
                        }else if(res.data){
                          vm.savingBotId = this.loadingBotId
                          this.isBuilt = true
                          this.isChanged = false

                          this.$store.dispatch('loadBot', res.data)
                        }else{
                            alert("Something is wrong!");
                        }
                    },
                    error: function(err){
                        this.waiting = false
                        alert("No response!!!");
                    },
                    timeout: 30000
                });
            }else{
                alert("Please Payment to load the BOT!");
            }
        }
      },
      saveBot(){
        // if(!jQuery("#save_bot_id").val()) {
        //   alert('Please input the specific name to save your own Bot')
        //   return
        // }

        // if(isChange || !isBuild){
        //   alert("Bots must be built before you can save them. Please build the bot first.")
        //   return
        // }

        if(!this.botKey){
          alert("Warning: Please Build")
          return
        }

        if(!this.boxes.length) {
          alert("Warning: There is no content to build the Bot.")
          return true;
        }

        jQuery.ajax({
            type: 'POST',
            url: url,
            xhrFields: {
                withCredentials: true
            },

            data:{
                action:'save_bot_dev',
                param:{
                    user_id: browser + ip,
                    data:{
                      boxes: this.$store.state.boxes,
                      scripts: this.$store.state.scripts,
                      docs: this.$store.state.docs,
                      ad: this.$store.state.ad,
                    },
                    save_bot_id: this.savingBotId
                }
            },
            dataType:'json',
            beforeSend: () => {
                this.waiting = true
            },
            success: (response) => {
                this.waiting = false
                /*
                if(response.message=="bot_notbuilt"){
                    alert("You must be build your bot before saving it - Click on \"Build EasyBot\" to build!");
                }else if(response.message=="bot_notpaid"){
                    alert("Please buy your bot, so you can save and load it at any time. Click on \"Own Your Bot\" for details.");
                }else if(response.message=="save ok"){
                    alert("Saved Successfully!");
                }else{
                    alert("Saving Failed. Try again later!");
                }
                */
                alert(response.message);
            },
            error: function(err){
                this.waiting = false
                alert("Failure!");
            },
            timeout: 30000
        });

      },
      sendSimilarWords(){
        this.waiting = true
        $.ajax({
          type: 'POST',
          url: url,
          xhrFields: { withCredentials: true },
    
          data:{
            action:'save_bot_dev',
            param:{
                slots: this.slots,
                user_id: browser + ip,
            }
          },
    
          dataType: 'json',
    
          success: function(response) {
            vm.waiting = false
            if(response.slotname){
              jQuery('#slotModal').modal('show')
              jQuery('#slotname').val(response.slotname)
              jQuery('#slotname_span').text(response.slotname)
            }else{
              alert(response)
            }
          },
          error: function(){
            vm.waiting = false
          },
          timeout: 300000
        });
      },

      changeSimilarWords(event){
        if(event.target.files[0].size > 1000000){
          alert('File Size should smaller than 1M')
          return false;
        }
        
        let filename = event.target.files[0].name
        
        if(!/^[a-zA-Z0-9-_]+$/.test(filename.split('.')[0])){
          event.target.value = null
          alert('File name is wrong. File name should include only alphabet letters, digits, and underline (_)')
          return false
        }
        
        const reader = new FileReader();
        
        reader.onload = (e) => {
            this.slots_file_name = filename;
            this.slot_data = e.target.result;
        };
        
        reader.readAsText(event.target.files[0]);
      },
      sendSlotsName(){
        if(!this.slots_file_name){
          alert('Choose the file.');
          return;
        }
        this.waiting = true
        $.ajax({
          type: 'POST',
          url: url,
          xhrFields: { withCredentials: true },
          data:{
            action:'save_bot_dev',
            param:{
                slots: {
                  slots_file_name: this.slots_file_name,
                  user_id: browser + ip,
                },
            }
          },
    
          dataType: 'json',
    
          success: function(response) {
            vm.waiting = false
            if(response.slotname){
              vm.slotname = response.slotname
              jQuery('#slotModal').modal('show')
            }else{
              alert(response)
            }
          },
          error: function(){
            vm.waiting = false
          },
          timeout: 300000
        });
      },
      submitSlots(){
        // jQuery('#slotModal').modal('hide')
        // slots.slotname = jQuery('#slotname').val()
        // if(!/^[a-zA-Z0-9-_]+$/.test(slots.slotname)){
        //   alert('Correct File Name')
        //   return false
        // }
        jQuery('#slotModal').modal('hide')
        this.waiting = true
        jQuery.ajax({
            type: 'POST',
            url: url,
            xhrFields: {
                withCredentials: true
            },
  
            data:{
              action:'save_bot_dev',
              param:{
                  slots: {
                    slotname: this.slotname,
                    slots_data: this.slot_data,
                    user_id: browser + ip
                  },
              }
            },
            success: function(response) {
              vm.waiting = false
              
              alert(response.message)
            },
            error: function(){
                jQuery("#overlay").fadeOut(300, function(){
                    alert("Error");
                });
            },
            timeout: 300000
        });
      },
      cancelSlots(){
        jQuery('#slotModal').modal('hide')
      }
    }
})
