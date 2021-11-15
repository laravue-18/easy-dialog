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

const app = new Vue({
  el: "#easyDialog",
  data(){
    return {
      insert: -1,
      isInsert: false,
      isInsertStart: false,
      isBuilt: false,
      boxes: [],
      scripts:[],
      docs: [],
      ad:[],
      id: 1,
      text: '',
      activeCases:{},

      edit_text: '',
      edit_box: null,
      edit_idx: null,

      clicks: 0,
      renderKey: 0,
      nexting: null,    
    }
  },
  computed:{
    prev_row_id(){
        return this.rows().length ? this.rows()[this.rows().length - 1].id : 0
    } 
  },

  updated(){
    jQuery(".focusElement").length && ( jQuery(".focusElement")[0].focus() )
  },
  methods: {
    reset () {
        Object.assign(this.$data, this.$options.data());
    },

    box(id){
      return this.boxes.find(i => i.id == id)
    },

    setPrevBox(prev_row_id){
      if(prev_row_id){
          let prev_box = this.box(prev_row_id)
          if(prev_box.action == 'hs'){
              this.getCase(prev_box.cases, this.activeCases[prev_row_id]).next = this.id
          }else if(prev_box.action == 'as'){
              prev_box.cases[0].next = this.id
          }else{
            let ad_case = prev_box.cases.find(i => i.content[1] == this.activeCases[prev_box.id] )
            if(ad_case){
                ad_case.next = this.id
            }else{
              prev_box.cases.push({
                  content: [prev_box.cases[0].content[0], this.activeCases[prev_box.id]],
                  next: this.id
              })

              if(prev_box.cases.length - 1 && ( prev_box.cases[0].content[0] == prev_box.cases[0].content[1] ) && ( prev_box.cases[0].next == 0 )){
                prev_box.cases.shift()
              } 
            }
          }
      }
    },

    prevReset(id){
      let box = this.box(this.rows().find(i => i.next == id).id)

      if(box.action == 'hs'){
          this.getCase(box.cases, this.activeCases[box.id]).next = 0
      }else if(box.action == 'as'){
          box.cases[0].next = 0
      }else{
          box.cases
            .find(i => i.content[0] == this.activeCases[box.id][0] && i.content[1] == this.activeCases[box.id])
            .next = 0
      }
    },
    
    isPrev(id){
      let cnt = 0
      let boxes = this.boxes
      boxes.forEach(box => {
        box.cases.forEach( item => {
          (item.next == id) && cnt++
        })
      })

      return cnt;
    },

    toggleInsert(val){
      this.insert === val ? 
        this.insert = -1 : ( this.boxes.length && (this.insert = val))
    },

    deleteBox(id){
      if(Number(id) && (!this.isPrev(id))){
          let list = this.box(id).cases.map( e => e.next)
          let idx = this.boxes.findIndex(e => e.id == id)
          this.boxes.splice(idx, 1)
          list.forEach(id => this.deleteBox(id))
      }
    },

    showEditModal(row, idx, text){
      this.edit_box = row.id
      this.edit_idx = idx
      this.edit_text = text
      
      let myModal = new bootstrap.Modal(document.getElementById('editModal'), {focus: true})
      myModal.show()
    },

    rows(){
      let box_id = 1;
      let rows = [];
      while(this.box(box_id)){
          let box = this.box(box_id)
          if(box.action == 'hs'){
              box_id = this.getCase(box.cases, this.activeCases[box_id]).next
          }else if(box.action == 'as'){
              box_id = box.cases[0].next
          }else if(box.action == 'ad'){
              let ad_case = box.cases.find(i => i.content[1] == this.activeCases[box_id] )
              if(ad_case){
                  box_id = ad_case.next
              }else{
                  box_id = 0
              }
          }else{
              alert('Something is wrong in Data! Data will be formatted! ');
              this.boxes = []
              this.id = 1
          }
          rows.push({
              id: box.id,
              action: box.action,
              next: box_id
          })
      }
      return rows;
    },

    ases(){
        let arr = this.rows().map(i => i.id)
        return this.boxes.filter(i => i.action == 'as' && !arr.includes(i.id))
    },

    main(row){
      return this.box(row.id).cases[0].content[0]
    },

    ad_mains(){
      return this.ad.map( i => i.main)
    },

    ad_subs(main){
        let arr = this.ad.find(element => element.main == main).sub
        // return arr
        return arr.slice(1)
    },
    
    getCase(arr, val){
      return arr.find(i => Array.isArray(i.content) ? i.content[1] == val : i.content == val)
    },

    addNewBox(action, prev_row_id, val){
      isChange = true
      if(this.insert == 0){
        (['hs', 'ad'].includes(this.box(1).action)) && (this.activeCases[this.id] = this.activeCases[1])
        this.box(1).id = this.id
        let arr = ( action == 'ad') ? [val, val] : val ;
        this.boxes.push({
            id: 1,
            action: action,
            cases: [{ content: arr, next: this.id}]
        });

        (['hs', 'ad'].includes(action)) && (this.activeCases[1] = arr)
      }else if(this.insert != -1){
        let prev_box = this.box(this.insert)
        let next
        if(prev_box.action == 'hs'){
          next = prev_box.cases.find(i => i.content == this.activeCases[prev_box.id] ).next
        }else if(prev_box.action == 'as'){
          next = prev_box.cases[0].next
        }else{
          next = prev_box.cases.find(i => i.content[0] == this.activeCases[prev_box.id][0] && i.content[1] == this.activeCases[prev_box.id][1] ).next
        }
        let arr = (action=='ad') ? [val, val] : val ;
        this.boxes.push({
            id: this.id,
            action: action,
            cases: [{ content: arr, next: next }]
        })
        this.activeCases[this.id] = val

        if(prev_box.action == 'hs'){
          prev_box.cases.find(i => i.content == this.activeCases[prev_box.id] ).next = this.id
          // prev_box.cases[0].next = this.id
        }else if(prev_box.action == 'as'){
            prev_box.cases[0].next = this.id
        }else{
          let ad_case = prev_box.cases.find(i => i.content[0] == this.activeCases[prev_box.id][0] && i.content[1] == this.activeCases[prev_box.id][1] )
            if(ad_case){
                ad_case.next = this.id
            }else{
              this.setPrevBox(prev_box);
              // prev_box.cases.push({
              //     content: [this.activeCases[prev_box.id][0], this.activeCases[prev_box.id][1]],
              //     next: this.id
              // })
            }
        }
      }else{
        if(action=='ad'){
          this.boxes.push({
            id: this.id,
            action: action,
            cases: [{
              'content': [val, val],
              'next': 0
            }]
          })
          this.activeCases[this.id] = val

          this.setPrevBox(prev_row_id)
        }else{
          this.boxes.push({
              id: this.id,
              action: action,
              cases: [{ content: val, next: 0}]
          })
          this.activeCases[this.id] = val
  
          this.setPrevBox(prev_row_id)
        }
      }
      this.insert = -1
      this.id++
    },
  
    addNewCase(type, id, e){
      let exist = false
      if(type == 'hs' && e.target.value){
          isChange = true
          let box = this.box(id)
          for(let i = 0, l = box.cases.length; i < l; i++){
            let branch = box.cases[i]
            if(branch.content == e.target.value) {
              alert('already exists')
              exist = true;
              break;
            }
          }
          if(exist) return
          box.cases.push({
              content: e.target.value,
              next: 0
          })
          this.activeCases[id] = e.target.value
      }else if(type == 'ad'){
        isChange = true
        let box = this.box(id)
        for(let i = 0, l = box.cases.length; i < l; i++){
          let branch = box.cases[i]
          if(branch.content[0] == e && (branch.content[1] == e)) {
            alert('already exists')
            exist = true;
            break;
          }
        }
        if(exist) return
        box.cases.push({
            content: [box.cases[0].content[0], e],
            next: 0
        })
        this.activeCases[id] = e
        this.renderKey++
      }
    },

    activeCase(row, i){
      if(this.activeCases[row.id] != i){
        this.activeCases[row.id] = i
        this.renderKey++
      }
    },
    
    deleteCase(row, flag, idx){

      let {id, action, next} = row
      
      if(this.box(id).cases.length - 1){
        swal("This will deletes this step and the connected flow. Proceed?", {
          buttons: ['Cancel', true]
        })
        .then((val) => {
          if(val){
            let next = this.box(id).cases[idx].next;
            this.box(id).cases.splice(idx, 1);
            if(flag){
              let content = this.box(id).cases[0].content;
              let active = Array.isArray(content) ? content[1] : content
              this.activeCases[id] = active  ;
            }
            this.deleteBox(next)
          }
        })
      }else if(id == 1){
        swal("This will deletes all data. Proceed?", {
          buttons: ['Cancel', true]
        })
        .then((val) => {
          if(val){
            this.boxes = []
            this.id = 1
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
              let box = this.box(this.rows().find(i => i.next == id).id)

              if(box.action == 'as'){
                box.cases[0].next = next
              }else{
                this.getCase(box.cases, this.activeCases[box.id]).next = next
              }

              let idx = this.boxes.findIndex(e => e.id == id)
              this.boxes.splice(idx, 1)
              break;
         
            case "all":
              this.prevReset(id)
              this.deleteBox(id)
              break;

            default:
              console.log('canceled')
          }
        });
      }

      this.renderKey++ ; 
    },

    updateCase(){
      let myModal = new bootstrap.Modal(document.getElementById('editModal'))
      myModal.hide()
      
      box = this.box(this.edit_box)
      box.cases[this.edit_idx].content = this.edit_text
      this.activeCases[this.edit_box] = this.edit_text

    },
    
    changeHsCase(row, i ,e){
      
      // e.target.readOnly = true
      let el = jQuery('<textarea rows="3">' + e.target.value + '</textarea>')
      el.css({position: 'absolute', top: '105%', left: 0, background: '#FFF', width: '100%', color: '#000', zIndex: 2})
      el.on('change blur', function(){
        isChange = true
        i.content = jQuery(this).val()
        app.activeCases[row.id] = i.content
        jQuery(this).remove()
      })
      el.on('keypress', function(event) {
          if (event.keyCode == 13) {
              event.preventDefault();
              jQuery(this).trigger('change')
          }
      });
      jQuery(e.target).next().after(el)
      el.focus()
    },
    
    updateAsCase(row, e){
      let el = jQuery('<textarea rows="3">' + e.target.value + '</textarea>')
      el.css({position: 'absolute', top: '105%', left: 0, background: '#FFF', width: '100%', color: '#000', zIndex: 2})
      el.on('change blur', function(e){
        isChange = true
        app.box(row.id).cases[0].content = jQuery(this).val()
        jQuery(this).remove()
      })
      el.on('keypress', function(event) {
          if (event.keyCode == 13) {
              event.preventDefault();
              jQuery(this).trigger('change')
          }
      });
      jQuery(e.target).after(el)
      el.focus()
    },

    changeAsCase(row, e){
      isChange = true
      this.box(row.id).cases[0].content = e.target.value
    },
    
    selectAsBox(i, e){
      let prev_row_id = this.prev_row_id;
      let prev_box = this.box(prev_row_id)
      if(prev_box.action == 'hs'){
        this.getCase(prev_box.cases, this.activeCases[prev_row_id]).next = i.id
      }else{
        isChange = true
        prev_box.cases.push({
          content: [this.activeCases[prev_box.id][0], this.activeCases[prev_box.id][1]],
          next: i.id
        })
      }
    },

    adClick(e){
      e.stopPropagation()
      jQuery(".dropList").css( 'visibility', 'hidden')
      jQuery(e.currentTarget).parent().find(".dropList").css('visibility', 'visible')
    },

    addAdMain(row, e){
      let val = e.target.value

      for(let i=0, l=this.ad.length; i<l; i++){
        if(this.ad[i].main == val){                 // If main already exists
          alert('already exists');
          return;
        }
      }

      this.ad.push({ main: val, sub:[val]})

      if(row){
        this.activeAd('main', row, val)
      }else{
        // this.activeAdMain(row, e)
        this.addNewBox('ad', this.prev_row_id, val)
      }
    },

    activeAd(type, row, val){
      let box = this.box(row.id)
      
      if(type=='main'){
        if(box.cases[0].content[0] != val){
          if(confirm('Would you change Main?')){
            let nexts = box.cases.map(i =>i.next).slice(1)
            next = box.cases[0].next
            box.cases = [{content: [val, val], next: next}]
            this.activeCases[row.id] = val
            for(i in nexts){
              this.deleteBox(nexts[i])
            }
          }
        }
      }else if(type=='sub'){
        if(box.cases[0].content[0] == box.cases[0].content[1] || (box.cases.length == 1 && ( box.cases[0].next == 0))){
            box.cases[0].content[1] = val
        }

        this.activeCases[row.id] = val
      }
      this.renderKey++
    },

    addAdSub(row, main, e){
      isChange = true
      let val = e.target.value
      let subs = this.ad_subs(main)
          
      for(let i=0, l=subs.length; i<l; i++){
        if(subs[i] == val) {
          alert('already exists');
          return;
        }
      }

      this.ad
          .find(element => element.main == main)
          .sub.push(val)

      this.activeAd('sub', row, val)
      
    },

    deleteStep(row){
      let {id, action, next} = row

      if(id == 1){
        swal("This will deletes all data. Proceed?", {
          buttons: ['Cancel', true]
        })
        .then((val) => {
          if(val){
            this.boxes = []
            this.id = 1
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
              let box = this.box(this.rows().find(i => i.next == id).id)

              if(box.action == 'as'){
                box.cases[0].next = next
              }else{
                this.getCase(box.cases, this.activeCases[box.id]).next = next
              }

              let idx = this.box(id).cases.findIndex(e => e.next == next)
              this.box(id).cases.splice(idx, 1)
              this.deleteBox(id)

              // let idx = this.boxes.findIndex(e => e.id == id)
              // this.boxes.splice(idx, 1)
              break;
         
            case "all":
              this.prevReset(id)
              this.deleteBox(id)
              break;

            default:
              console.log('canceled')
          }
        });
      }

      // this.ad = this.ad.filter( e => e.main != main)

      // let i = this.boxes.length
      // while(i--){
      //   let box = this.boxes[i]
      //   if(box.action == "ad"){
      //     let j = box.cases.length
      //     while(j--){
      //       if(box.cases[j].content[0] == main){
      //         let next = box.cases[j].next
      //         box.cases.splice(j, 1)
      //         this.deleteBox(next)
      //       }
      //     }
      //     if(!box.cases.length){
      //       if(box.id != 1){
      //         let boxes = this.boxes
      //         let k = boxes.length
      //         while(k--){
      //           let b = boxes[k]
      //           let l = b.cases.length
      //           while(l--){
      //             if(b.cases[l].next == box.id) b.cases[l].next = 0
      //           }
      //         }
      //         this.boxes.splice(i, 1)
      //       }else{
      //         this.boxes = []
      //         this.id = 1
      //       }
      //     }else{
      //       this.activeCases[box.id] = box.cases[0].content
      //     }
      //   }
      // }
    },

    deleteAdSub(main, sub){
        let r = confirm("This will deletes this step and the connected flow. Proceed?" );
      if(!r) return
      
      isChange = true

        this.ad.find( x => x.main == main).sub.remove(sub)

      let i = this.boxes.length
      while(i--){
        let box = this.boxes[i]
        if(box.action == "ad"){
          let j = box.cases.length
          while(j--){
            if(box.cases[j].content[0] == main && box.cases[j].content[1] == sub){
              let next = box.cases[j].next
              box.cases.splice(j, 1)
              this.deleteBox(next)
            }
          }
          if(!box.cases.length){
            if(box.id != 1){
              let boxes = this.boxes
              let k = boxes.length
              while(k--){
                let b = boxes[k]
                let l = b.cases.length
                while(l--){
                  if(b.cases[l].next == box.id) b.cases[l].next = 0
                }
              }
              this.boxes.splice(i, 1)
            }else{
              this.boxes = []
              this.id = 1
            }
          }else{
            this.activeCases[box.id] = box.cases[0].content
          }
        }
      }
    },

    getImage(row){
        if(doc = this.docs.find( i => i.caseid == row.id))
        return doc.data
        return null
    },
    
    updatePhotoPreview(row, event) {
      isChange = true
      
        if(event.target.files[0].size > 1000000){
            alert('File Size should smaller than 1M')
            return false;
        }

        let filename = event.target.files[0].name

      if(!/^[a-zA-Z0-9-_]+$/.test(filename.split('.')[0])){
        alert('File name is wrong. File name should include only alphabet letters, digits, and underline (_)')
        return false
      }
      
      const reader = new FileReader();

      reader.onload = (e) => {
          // this.box(row.id).cases[0].docs = e.target.result;
          doc = this.docs.find( i => i.caseid == row.id)
          if(doc){
            doc.data = e.target.result
          doc.doc_name = filename
          }else{
            this.docs.push({
              'caseid': row.id,
              'doc_name': filename,
              'data': e.target.result
            })
          }
          
          this.renderKey ++ ;
      };

      reader.readAsDataURL(event.target.files[0]);
    },
    selectNewPhoto(e){
        e.target.previousElementSibling.click()
    },
    deletePhoto(row){
      isChange = true
      let i = this.docs.findIndex( i => i.caseid == row.id) 
      this.docs[i].data = null
      this.docs[i].doc_name = null
      this.renderKey ++
    },
    getScript(row){
        if(script = this.scripts.find( i => i.caseid == row.id))
        return script.script_name
        return false
    },
    updateScript(row, event) {
      isChange = true
        if(event.target.files[0].size > 100000){
          event.target.value = null
            alert('File Size should smaller than 100KB')
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
            // this.box(row.id).cases[0].docs = e.target.result;
            script = this.scripts.find( i => i.caseid == row.id)
            if(script){
                script.data = e.target.result
                  script.script_name = filename
            }else{
                this.scripts.push({
                  'caseid': row.id,
                  'script_name': filename,
                  'data': e.target.result
              })
            }
            
            this.renderKey ++ ;
        };
        // reader.readAsDataURL(event.target.files[0]);
        reader.readAsText(event.target.files[0]);
    },
    selectNewScript(e){
        e.target.previousElementSibling.click()
    },
    deleteScript(row){
      isChange = true
      let i = this.scripts.findIndex( i => i.caseid == row.id) 
      this.scripts[i].data = null
      this.scripts[i].script_name = null
      this.renderKey ++
    },
    // updateScript(event){
    //   isChange = true
    //   if(event.target.files[0].size > 1000000){
    //     alert('File Size should smaller than 1M')
    //     return false
    //   }
    //   let filename = event.target.files[0].name
    //   const reader = new FileReader()
    //   reader.onload = (e) => {
    //     this.script = {
    //       script_name: filename,
    //       data: e.target.result
    //     }
    //   }

    //   reader.readAsDataURL(event.target.files[0]);
    // },
    // removeScript(){
    //   isChange = true
    //   this.script = null
    //   this.renderKey ++
    // },
    setBox(data){
        this.boxes = data.boxes
      this.activeCases = data.activeCases ? data.activeCases : {}
      this.activeCases = data.activeCases ? data.activeCases : {}
      this.docs = data.docs? data.docs : []
      this.ad = data.ad ? data.ad : []
      this.id = data.id
      this.renderKey++
    },
    processBoxes(){
        this.boxes.map( box => {
          if(box.action == "ad"){
            if(!box.cases.length){
              box.cases.push({
                content: this.activeCases[box.id],
                next: 0
            })
          }
        }
      });
    },
    setNext(){
      
    }
  },
});

jQuery(document).blur(function (e) {
  if (!jQuery(e.target).is(".dropList") && jQuery(e.target).parents(".dropList").length === 0 && !jQuery(e.target).next().is(".dropList") && !jQuery(e.target).parent().next().is(".dropList")) 
  {
      jQuery(".dropList").toArray().forEach( element => element.style.visibility = 'hidden')
  }
});

var slots = {}

jQuery('#similar_words').change(function(event){
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
  slots = {
    'slots_file_name': filename,
    'slots_data': e.target.result,
    user_id: browser + ip
  }
};

  reader.readAsText(event.target.files[0]);
})

jQuery('#submit_words').click(function(){
  jQuery.ajax({
      type: 'POST',
      url: url,
      xhrFields: {
          withCredentials: true
      },

      data:{
        action:'save_bot_dev', 
        param:{
            slots
        }
      },
      
      // dataType: 'json', 
      
      beforeSend: function() {
          jQuery("#overlay").fadeIn(300);
      },
      success: function(response) {
          jQuery("#overlay").fadeOut(300, function(){
            if(response.slotname){
              jQuery('#slotModal').modal('show')
              jQuery('#slotname').val(response.slotname)
              jQuery('#slotname_span').text(response.slotname)
            }
          });
      },
      error: function(){                     
          jQuery("#overlay").fadeOut(300, function(){
              alert("Error");
          });
      },
      timeout: 300000
  });
})

jQuery('#slotname_submit').click(function(){
  jQuery('#slotModal').modal('hide')
  slots.slotname = jQuery('#slotname').val()
  if(!/^[a-zA-Z0-9-_]+$/.test(slots.slotname)){
    alert('Correct File Name')
    return false
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
                slots
            }
          },
          
          // dataType: 'json', 
          
          beforeSend: function() {
              jQuery("#overlay").fadeIn(300);
          },
          success: function(response) {
              jQuery("#overlay").fadeOut(300, function(){
                  alert(response.message)
              });
          },
          error: function(){                     
              jQuery("#overlay").fadeOut(300, function(){
                  alert("Error");
              });
          },
          timeout: 300000
      });
})

jQuery('#slotname_cancel').click(function(){
  jQuery('#slotModal').modal('hide')
})


/****** Execute Button ****/

jQuery("#create_test").click(() => {
  if(browser && ip){
      if(!app.boxes.length) {
        alert("Warning: There is no content to build the Bot.")
        return true;
      }
      app.processBoxes();
      let r = confirm(JSON.stringify(app.boxes));
      
      if(r)
      jQuery.ajax({
          type: 'POST',
          url: url,
          xhrFields: {
              withCredentials: true
          },

          data:{
            action:'build_bot_dev', 
            param:{
                data:{
                  boxes: app.boxes,
                  scripts: app.scripts,
                  docs: app.docs,
                  activeCases: app.activeCases,
                  activeCases: app.activeCases,
                  ad: app.ad,
                  id: app.id
                },
                user_id: browser + ip
            }
          },
          
          dataType: 'json', 
          
          beforeSend: function() {
              jQuery("#overlay").fadeIn(300);
          },
          success: function(response) {
              jQuery("#overlay").fadeOut(300, function(){
                  try{
                  jQuery("#key-us").text(response.password.en);
                  jQuery("#key-de").text(response.password.de);
                  jQuery("#key-fr").text(response.password.fr);
                  jQuery("#key-ja").text(response.password.ja);
                  
                  if(response.message){
                      alert(response.message);
                    isBuild = true
                    isChange = false
                  }else{
                      alert('Something happend!!!')
                  }
                }catch(err){
                    alert("Data Format Error:" + err)
                }
              });
          },
          error: function(){                     
              jQuery("#overlay").fadeOut(300, function(){
                  alert("There was an issue building your Bot. Please click \"Build easyBot\" again to try again.");
              });
          },
          timeout: 300000
      });
  }
});    

jQuery("#reset").click(() => {
app.reset()
})

/*** Load Button ***/

jQuery("#loadBot").on('keydown', function(e){
  if(e.keyCode == 13){
      jQuery("#load_btn").click();
  }
});

jQuery("#load_btn").click((e) => {
if(!jQuery("#loadBot").val()) {
  alert('Input name to load the Bot')
  return
}
  e.preventDefault();
  let k = true;
  if(isChange) k = confirm("The current bot hasn’t been built.\n Shall I still load a new bot?");
  if(k){
      // if(Number(jQuery("#save_flag").val())){
      if(1){
          let loading_bot_id = jQuery('#loadBot').val();
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
                      bot_id: loading_bot_id
                  }
              },
              dataType:'json',
              beforeSend: function() {
                  jQuery("#overlay").fadeIn(300);
              },
              success: function(res) {
                  jQuery("#overlay").fadeOut(300, function(){
                      try{
                      if(res.message){
                        alert(res.message);                         
                      }else if(res.data){
                        jQuery('#save_bot_id').val(loading_bot_id)
                        isBuild = true
                        isChange = false
                        let data = res.data
                        if(data.hs_active){
                          data.activeCases = {
                            ...data.hs_active,
                            ...data.ad_active,
                          }
                        }
                        for(const property in data.activeCases){
                          if(Array.isArray(data.activeCases[property])){
                            data.activeCases[property] = data.activeCases[property][1]
                          }
                        }
                        app.setBox(data)
                      }else{
                          alert("Something is wrong!"); 
                      }
                    }catch(err){
                        alert(err.message)
                    }
                  });
              },
              error: function(err){                
                  jQuery("#overlay").fadeOut(300, function(){
                      alert("No response!!!");
                  });
              },
              timeout: 30000
          });
      }else{
          alert("Please Payment to load the BOT!");
      }
  }
});


/*** Save Button ***/

jQuery("#save_bot_id").keydown(function(e){
  if(e.keyCode == 13 ){
      jQuery("#save_bot_btn").click();
  }
});

jQuery("#save_bot_btn").click(() => {
  // if(!jQuery("#save_bot_id").val()) {
  //   alert('Please input the specific name to save your own Bot')
  //   return
  // }

  // if(isChange || !isBuild){
  //   alert("Bots must be built before you can save them. Please build the bot first.")
  //   return
  // }

  // if(!isBuild){
  //   alert("Warning: Please Build")
  //   return
  // }

  if(!app.boxes.length) {
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
                boxes: app.boxes,
                scripts: app.scripts,
                docs: app.docs,
                activeCases: app.activeCases,
                activeCases: app.activeCases,
                ad: app.ad,
                id: app.id
              },
              save_bot_id: jQuery("#save_bot_id").val()
          }
      },
      dataType:'json',
      beforeSend: function() {
          jQuery("#overlay").fadeIn(300);
      },
      success: function(response) {
          jQuery("#overlay").fadeOut(300, function(){
            try{
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
            }catch(err){
              alert(err.message)
            }
          });
      },
      error: function(err){
          jQuery("#overlay").fadeOut(300, function(){
              alert("Failure!");
          });
      },
      timeout: 30000
  });
});

jQuery('#insertStart').on('click', function(){
app.isInsertStart = true
app.isInsert = 's'
})


function autocomplete(inp, arr) {
  var currentFocus;
  function autocompleteListener(){
      
  }

  inp.addEventListener("input", function(e) {
      let a, b, i, val = this.value;
      closeAllLists();
      //if (!val) { return false;}
      currentFocus = -1;

      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
  
      this.parentNode.appendChild(a);
  
      for (i = 0; i < arr.length; i++) {
      
          if (val.length == 0 || arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              b = document.createElement("DIV");
              b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
              b.innerHTML += arr[i].substr(val.length);                        
              b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";                        
              b.addEventListener("click", function(e) {                            
                  inp.value = this.getElementsByTagName("input")[0].value;                            
                  closeAllLists();
              });
              a.appendChild(b);
          }
      }
  });

  inp.addEventListener("focus", function(e) {
      let a, b, i, val = this.value;
      closeAllLists();
      //if (!val) { return false;}
      currentFocus = -1;
      
      a = document.createElement("DIV");
      a.setAttribute("id", this.id + "autocomplete-list");
      a.setAttribute("class", "autocomplete-items");
      
      this.parentNode.appendChild(a);

      for (i = 0; i < arr.length; i++) {
          
          if (val.length == 0 || arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
              b = document.createElement("DIV");
              b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
              b.innerHTML += arr[i].substr(val.length);
              b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
              b.addEventListener("click", function(e) {
                  inp.value = this.getElementsByTagName("input")[0].value;
                  closeAllLists();
                  document.querySelector("#load_btn").click();
              });
              a.appendChild(b);
          }
      }
  });    

  inp.addEventListener("keydown", function(e) {
      var x = document.getElementById(this.id + "autocomplete-list");
      if (x) x = x.getElementsByTagName("div");
      if (e.keyCode == 40) {
          currentFocus++;        
          addActive(x);
      } 
      else if (e.keyCode == 38) { //up
          currentFocus--;        
          addActive(x);
      } 
      else if (e.keyCode == 13) {
          e.preventDefault();
          if (currentFocus > -1) {
              if (x) x[currentFocus].click();
          }
      }
  });
  function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {                
      for (var i = 0; i < x.length; i++) {
          x[i].classList.remove("autocomplete-active");
      }
  }
  function closeAllLists(elmnt) {
      var x = document.getElementsByClassName("autocomplete-items");
      for (var i = 0; i < x.length; i++) {
          if (elmnt != x[i] && elmnt != inp) {
              x[i].parentNode.removeChild(x[i]);
          }
      }
  }
  
  document.addEventListener("click", function (e) {
      closeAllLists(e.target);
  });
}

var bots = ["weather","wetter","week weather","tianqi"];
autocomplete(document.getElementById("loadBot"), bots);

//*** Prevent the backspace key from navigating back. ***//
jQuery(document).unbind('keydown').bind('keydown', function (event) {
  if (event.keyCode === 8) {
      var doPrevent = true;
      var types = ["text", "password", "file", "search", "email", "number", "date", "color", "datetime", "datetime-local", "month", "range", "search", "tel", "time", "url", "week"];
      var d = jQuery(event.srcElement || event.target);
      var disabled = d.prop("readonly") || d.prop("disabled");
      if (!disabled) {
          if (d[0].isContentEditable) {
              doPrevent = false;
          } else if (d.is("input")) {
              var type = d.attr("type");
              if (type) {
                  type = type.toLowerCase();
              }
              if (types.indexOf(type) > -1) {
                  doPrevent = false;
              }
          } else if (d.is("textarea")) {
              doPrevent = false;
          }
      }
      if (doPrevent) {
          event.preventDefault();
          return false;
      }
  }
});
