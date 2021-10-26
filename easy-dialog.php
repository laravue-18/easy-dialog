<div id="main-content">
  <div class="container">
    <div class="row">       

      <div id="overlay">
        <div class="cv-spinner">
          <span class="spinner"></span>
        </div>
      </div>

      <div id="slotModal" class="modal fade" data-backdrop="static" tabindex="-1" role="dialog">
        <div class="modal-dialog" style="margin-top: 150px">
          <div class="modal-content" style="padding:15px">
            <h5>Do you want to name this list of words "<span id="slotname_span"></span>"? If not please, please change the name to a word of your choice?</h5>
            <input type="text" class="form-control" id="slotname" style="border: 1px solid #ddd !important; margin-bottom: 15px;">
            <input id="slotname_submit" type="button" class="btn btn-primary" value="Submit" style="color: white">
            <input id="slotname_cancel" type="button" class="btn" value="Cancel" style="">
          </div>
        </div>
      </div>

      <div class="" style="word-break:break-all;">
        <input id="user_id" value="" hidden  />

        <header class="alexa-header">
          <div class="top-bar" style="">
            <div class="buttons">
              <div class="load-bot">
                <form autocomplete="off" action="">
                  <input 
                    id="loadBot" 
                    class="autocomplete" 
                    type="text" 
                    placeholder="Bot name ... " 
                    style="background:#fff;"
                  >
                  <input 
                    id="load_btn" 
                    class="loading" 
                    type="submit" 
                    value="Load Bot"
                    style="
                      background:transparent; 
                      color:#fff; 
                      border:solid 1px #fff !important; 
                      border-radius:12px; 
                      padding:0px 10px;"
                  >
                </form>
              </div>
              <div class="save-bot">
                <input id="save_flag" type="text" value="0" hidden/>
                <input 
                  id="save_bot_id" 
                  type="text" 
                  placeholder="Bot name..." 
                  style="background:#fff;"
                >
                <button 
                  id="save_bot_btn" 
                  style="
                      background:transparent; 
                      color:#fff; 
                      border:solid 1px #fff; 
                      border-radius:12px; 
                      padding:0px 10px;"
                >
                  Save Bot
                </button>
              </div>
              <a 
                id="instruction" 
                href="https://easydialog.org/easybot-design-and-run-ai-bots-fast/" 
                target="[_blank]"
                style="
                  background-image: linear-gradient(to bottom, #fd5500, #922b02); 
                  color:#fff; 
                  text-align: center; 
                  align-self: center; 
                  padding: 6px; 
                  border:none; 
                  border-radius:12px;" 
              >
                Help / How-To
              </a>
              <button 
                id="buy-easybot" 
                class="buy-bot" 
                style="
                  background-image: linear-gradient(to bottom, #fd5500, #922b02); 
                  padding:6px; 
                  border:none; 
                  border-radius:12px;"
              >
                Own Your Bot
              </button>
              <button id="" class="buy-bot-aa" style="display: none;"></button>
            </div>
          </div>
          <div class="multi-bot-key">
            <div class="key-title"><span>Bot Keys:</span></div>
            <div class="mobile-flex">
              <div class="key-field">
                <!-- <img src="https://easydialog.org/wp-content/uploads/2020/10/us.png" style=""> -->
                <span id="key-us" style="text-shadow:2px 3px 3px #000;"></span>
              </div>
            </div>
            
            <!--
            ORIGINAL POSITION OF THE SLOT
            -->
            
          </div>
          <div class="asRow">
            <div class="rowNumber">
              <!-- <button class="btn" id="insertStart">+</button> -->
            </div>
            <div class="rowBody">
              <div class="asBox">Human Says:</div>
              <div class="asBox">Al Says:</div>
              <div class="asBox">Al Does:</div>
            </div>
          </div>
        </header>

        <section class="alexa-section">
          <div id="easyDialog">
            <div :key="renderKey">
              <div class="asRow">  <!-- StartRow -->
                <div class="rowNumber">
                    <button class="btn btn-light rounded-circle p-0" style="width: 2rem; height: 2rem;" @click="toggleInsert(0)">
                      {{ insert === 0 ? '-' : '+' }}
                    </button>
                </div>
                <template v-if="insert === 0">
                  <div class="rowBody">
                      <div class="asBox">
                          <template v-if="rows()[0]['action'] != 'hs'">
                              <input class="focusElement" type="text" placeholder="type human sentence" :value="text" @change="addNewBox('hs', prev_row_id, $event.target.value)">
                          </template>
                      </div>
                      <div class="asBox">
                        <template v-if="rows()[0]['action'] != 'as'">
                          <input class="focusElement" type="text" placeholder="type AI sentence" :value="text" @change="addNewBox('as', prev_row_id, $event.target.value)" @click="adClick">
                          <div v-if="ases().length" class="dropList">
                              <template v-for="i in ases()">
                                  <div class="adItem">
                                      <input type="text" :value="i.cases[0].content" @click="selectAsBox(i, $event)" readonly>
                                  </div>
                              </template>
                          </div>
                        </template>
                      </div>
                      <div class="asBox">
                        <template 
                          v-if="rows()[0]['action'] != 'ad'"
                        >
                          <div class="row g-0">
                            <div class="col-6 p-1">
                              <div class="btn-group d-grid">
                                <button type="button" class="btn bg-white dropdown-toggle text-start arrow-end btn-sm" data-bs-toggle="dropdown" aria-expanded="false">
                                  Select Main
                                </button>
                                <ul class="dropdown-menu">
                                  <li class="p-1"><input type="text" class="form-control-sm" @change="addAdMain(false, $event, -1)" placeholder="Add New ..."></li>
                                  <li><hr class="dropdown-divider"></li>
                                  <li v-for="main in ad_mains()">
                                    <span class="dropdown-item" @click="addNewBox('ad', prev_row_id, main)">{{main}}</span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div class="col-6 p-1">
                            </div>
                          </div>
                        </template>
                      </div>
                  </div>
                </template>
              </div>
              <template v-for="(row, index) in rows()" :key="index">
                <div class="asRow">
                  <div class="rowNumber">
                    <button class="btn btn-light rounded-circle p-0" style="width: 2rem; height: 2rem;" @click="toggleInsert(row.id)">
                      {{ insert === row.id ? '-' : '+' }}
                    </button>
                  </div>
                  <div class="rowBody">
                    <template v-if="row.action == 'hs'">
                      <div class="asBox">
                        <div class="d-none">
                          <div class="btn btn-primary btn-sm">{{ row.id }}</div>
                        </div>
                        <div 
                          v-for="(i, idx) in box(row.id).cases"
                          class="hsCase" 
                          :class="{active: i.content == activeCases[row.id]}"
                          @click.stop.prevent = "activeCase(row, i.content)"
                        >
                          <input
                            class="listItem"
                            type="text"
                            :value = "i.content"
                            @dblclick="changeHsCase(row, i, $event)"
                            readonly
                          >
                          <span class="removeMark" @click.stop.prevent="deleteCase(row, i.content == activeCases[row.id], idx)">×</span>
                        </div>
                        <input type="text" placeholder="type human sentence" :value="text" @keyup.enter="addNewCase('hs', row.id, $event)">
                      </div>
                      <div class="asBox"></div>
                      <div class="asBox"></div>
                    </template>
                    <template v-else-if="row.action == 'as'">
                      <div class="asBox"></div>
                      <div class="asBox">
                        <div class="asCase" @click="adClick">
                            <input class="listItem"
                                type="text" 
                                :value="box(row.id).cases[0].content"
                                @click = "updateAsCase(row, $event)"
                                
                                @change="changeAsCase(row, $event)" 
                                @blur="changeAsCase(row, $event)" 
                                @keyup.enter="changeAsCase(row, $event)"
                                readonly>
                            <span class="removeMark" @click.stop.prevent="deleteCase(row)">×</span>
                        </div>
                        <div class="mt-2" v-if="getImage(row)">
                          <div 
                            style="
                              height: 100px; 
                              margin: 3px 0; 
                              border: 1px solid white;
                              background: black;
                              background-size: contain;
                              background-repeat: no-repeat;
                              background-position: center center;"
                            :style="'background-image: url(\'' + getImage(row) + '\');'"
                          ></div>
                        </div>
                        <input 
                          type="file" hidden
                          ref="photo"
                          style="visibility:hidden; height: 0;"
                          @blur="updatePhotoPreview(row, $event)"
                        >
                        <button
                          @click="selectNewPhoto"
                          style="
                            margin: 3px;
                            padding: 5px 10px;
                            border-radius: 9999px;
                            height: 2.2em;"
                        >
                          Select Image
                        </button>
                        <button 
                          @click="deletePhoto(row)" v-show="getImage(row)"
                          style="
                            margin: 3px;
                            padding: 5px 10px;
                            border-radius: 9999px;
                            height: 2.2em;"
                        >
                          Remove Image
                        </button>
                        <div v-if = "!nexting" class="d-none">
                          <button
                            style="
                              margin: 3px;
                              padding: 5px 10px;
                              border-radius: 9999px;
                              height: 2.2em;"
                            data-bs-toggle="modal" data-bs-target="#exampleModal"
                          >
                            Choose Next Step
                          </button>

                          <!-- Modal -->
                          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                            <div class="modal-dialog">
                              <div class="modal-content">
                                <div class="modal-header">
                                  <h5 class="modal-title" id="exampleModalLabel">Select</h5>
                                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                </div>
                                <div class="modal-body">
                                  <select name="" id="" class="form-control">
                                    <option v-for="row in rows()" value="row.id">{{ row.id }}</option>
                                  </select>
                                </div>
                                <div class="modal-footer">
                                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                  <button type="button" class="btn btn-primary" @click="setNext">Save changes</button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div v-if="ases().length" class="dropList">
                          <template v-for="i in ases()">
                            <div class="adItem">
                              <input type="text" :value="i.cases[0].content" @click="selectAsBox(i, $event)" readonly>
                            </div>
                          </template>
                        </div>
                      </div>
                      <div class="asBox"></div>
                    </template>
                    <template v-else-if="row.action == 'ad'">
                        <div class="asBox"></div>
                        <div class="asBox"></div>
                        <div class="asBox">
                          <!-- new -->
                          <div class="row g-0">
                            <div class="col-6 p-1">
                                <div class="btn-group d-grid">
                                  <button type="button" class="btn bg-eb-primary text-white dropdown-toggle text-start arrow-end btn-sm" data-bs-toggle="dropdown" aria-expanded="false">
                                    {{ main(row) }}
                                  </button>
                                  <ul class="dropdown-menu">
                                    <li class="p-1"><input type="text" class="form-control-sm" @change="addAdMain(row, $event)" placeholder="Add New ..."></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li v-for="main in ad_mains()">
                                      <span class="dropdown-item" @click="activeAd('main', row, main)">{{main}}</span>
                                    </li>
                                  </ul>
                                </div>
                                <div class="mt-1">
                                  <input 
                                    type="file" hidden
                                    ref="photo"
                                    style="visibility:hidden; height: 0;"
                                    @change="updateScript(row, $event)"
                                  >
                                  <button
                                    @click="selectNewScript"
                                    class="btn bg-white"
                                  >
                                    Select Script
                                  </button>
                                  <button 
                                    @click="deleteScript(row)" v-show="getScript(row)"
                                    style="
                                      margin: 3px;
                                      padding: 5px 10px;
                                      border-radius: 9999px;
                                      height: 2.2em;"
                                  >
                                    Remove Script
                                  </button>
                                </div>
                            </div>
                            <div class="col-6 p-1">
                                <div class="btn-group d-grid">
                                  <button type="button" class="btn dropdown-toggle text-white text-start arrow-end bg-eb-primary btn-sm" data-bs-toggle="dropdown" aria-expanded="false">
                                    {{ activeCases[row.id] }}
                                  </button>
                                  <ul class="dropdown-menu">
                                    <li class="p-1"><input type="text" class="form-control-sm" @change="addAdSub(row, box(row.id).cases[0].content[0], $event)" placeholder="Add New ..."></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li v-for="sub in ad_subs(box(row.id).cases[0].content[0])">
                                      <span class="dropdown-item mb-1 d-flex justify-content-between" :class="box(row.id).cases.map(i => i.content[1]).includes(sub) ? 'bg-eb-primary' : ''" @click="activeAd('sub', row, sub)">
                                        <span>{{ sub }}</span>
                                        <template v-if="box(row.id).cases.map(i => i.content[1]).includes(sub)">
                                          <span
                                            @click.stop="deleteCase(row, sub == activeCases[row.id], box(row.id).cases.map(i => i.content[1]).indexOf(sub))"
                                          >×</span>
                                        </template>
                                      </span>
                                    </li>
                                  </ul>
                                </div>
                              
                            </div>
                          </div>
                        </div>
                    </template>
                  </div>
                </div>
                <template v-if="row.id == insert">
                  <div class="asRow">
                    <div class="rowNumber">
                      <input type="text" :value="rows().length + 1">
                    </div>
                    <div class="rowBody">
                        <div class="asBox">
                            <template v-if=" row.action != 'hs' ">
                                <input class="focusElement" type="text" placeholder="type human sentence" :value="text" @change="addNewBox('hs', prev_row_id, $event.target.value)">
                            </template>
                        </div>
                        <div class="asBox">
                          <template  v-if=" row['action'] != 'as' ">
                            <input class="focusElement" type="text" placeholder="type AI sentence" :value="text" @change="addNewBox('as', prev_row_id, $event.target.value)" @click="adClick">
                            <div v-if="ases().length" class="dropList">
                                <template v-for="i in ases()">
                                    <div class="adItem">
                                        <input type="text" :value="i.cases[0].content" @click="selectAsBox(i, $event)" readonly>
                                    </div>
                                </template>
                            </div>
                          </template>
                        </div>
                        <div class="asBox">
                          <template 
                            v-if="row['action'] != 'ad'"
                          >
                            <div class="row g-0">
                              <div class="col-6 p-1">
                                <div class="btn-group d-grid">
                                  <button type="button" class="btn bg-white dropdown-toggle text-start arrow-end btn-sm" data-bs-toggle="dropdown" aria-expanded="false">
                                    Select Main
                                  </button>
                                  <ul class="dropdown-menu">
                                    <li class="p-1"><input type="text" class="form-control-sm" @change="addAdMain(false, $event, -1)" placeholder="Add New ..."></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li v-for="main in ad_mains()">
                                      <span class="dropdown-item" @click="addNewBox('ad', prev_row_id, main)">{{main}}</span>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                              <div class="col-6 p-1">
                              </div>
                            </div>
                          </template>
                        </div>
                    </div>
                  </div>
                </template>
              </template>
              <template v-if="!(insert + 1)">
                <div class="asRow">
                  <div class="rowNumber">
                    <input type="text" :value="rows().length + 1">
                  </div>
                  <div class="rowBody">
                      <div class="asBox">
                          <template v-if="rows().length ? rows()[rows().length-1]['action'] != 'hs' : true">
                              <input class="focusElement" type="text" placeholder="type human sentence" :value="text" @change="addNewBox('hs', prev_row_id, $event.target.value)">
                          </template>
                      </div>
                      <div class="asBox">
                        <template 
                          v-if="rows().length ? rows()[rows().length-1]['action'] != 'as' : true"
                        >
                          <input class="focusElement" type="text" placeholder="type AI sentence" :value="text" @change="addNewBox('as', prev_row_id, $event.target.value)" @click="adClick">
                          <div v-if="ases().length" class="dropList">
                              <template v-for="i in ases()">
                                  <div class="adItem">
                                      <input type="text" :value="i.cases[0].content" @click="selectAsBox(i, $event)" readonly>
                                  </div>
                              </template>
                          </div>
                        </template>
                      </div>
                      <div class="asBox">
                        <template 
                          v-if="rows().length ? rows()[rows().length-1]['action'] != 'ad' : true"
                        >
                          <div class="col-6 p-1">
                            <div class="btn-group d-grid">
                              <button type="button" class="btn bg-white dropdown-toggle text-start arrow-end btn-sm" data-bs-toggle="dropdown" aria-expanded="false">
                                Select Main
                              </button>
                              <ul class="dropdown-menu">
                                <li class="p-1"><input type="text" class="form-control-sm" @change="addAdMain(false, $event, -1)" placeholder="Add New ..."></li>
                                <li><hr class="dropdown-divider"></li>
                                <li v-for="main in ad_mains()">
                                  <span class="dropdown-item" @click="addNewBox('ad', prev_row_id, main)">{{main}}</span>
                                </li>
                              </ul>
                            </div>
                          </div>
                          <div class="col-6 p-1">
                          </div>
                        </template>
                      </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </section>

        <footer class="alexa-footer">
          <div>
              <div style="display: flex;">
                <button 
                  id="create_test" 
                  class="btn btn-primary btn-lg" 
                  style="
                    display:block; 
                    margin:0 auto; 
                    padding:10px 30px; 
                    background-image:linear-gradient(to bottom, #fe5500, #932b02); 
                    border:none; 
                    border-radius:30px;"
                >
                  <span 
                    style="
                      font-family:Roboto; 
                      font-weight:bold; 
                      letter-spacing:1px; 
                      text-shadow:0px 0px 20px #000;"
                  >
                    BUILD easyBOT
                  </span>
                </button>
                <!-- <button 
                  id="reset" 
                  class="btn btn-primary btn-lg" 
                  style="
                    display:block; 
                    margin:0 auto; 
                    padding:10px 30px; 
                    background-image:linear-gradient(to bottom, #fe5500, #932b02); 
                    border:none; 
                    border-radius:30px;"
                >
                  <span 
                    style="
                      font-family:Roboto; 
                      font-weight:bold; 
                      letter-spacing:1px; 
                      text-shadow:0px 0px 20px #000;"
                  >
                    Reset
                  </span> -->
                </button>
              </div>
              
              <div class="register_slot" style="display:flex; justify-content:center; align-items: center; padding: 15px; border-top: solid 1px; margin: 15px;">
                <button type="button" class="btn" style="width: 34px; height: 34px; background: transparent; border:1px solid #fff; border-radius: 9999px; color: white;" data-toggle="tooltip" data-placement="top" data-html="true" title="<p style='text-align: justify;'>Sometimes you want your bot to treat a group of words in the same way. For example, you have a group of friends called John, Jim and Mary. If you design a phone call bot, in easyBot you only need to add a sentence like “Call John on his phone”, and add Jim and Mary as “similar” words to John by uploading a text file, that lists John, Jim and Mary in separate lines. After this, any of your bot users can also say “Call Jim on his phone” or “Call Mary on her phone”, and get the same bot flow that you defined for “Call John on his phone”.Place names, time and date, and other common groups of similar words are automatically recognized by easyBot. They do not need to be registered.</P>">?</button>
                <div class=col_label>
                  <label for="similar_words" id="words-label">Register Similar Words : </label>
                </div>
                <div class=col_file style="display:flex;">
                  <input 
                    type="file" 
                    name="similar_words" 
                    id="similar_words" 
                    style="font-size: 15px; border:1px solid #ddd; border-radius: 3px; background: white; padding: 5px;">
                  <button id="submit_words" style="color:black; border-radius:9999px; font-size:20px; width:80px; margin-left: 10px;">Send</button>
                </div>
              </div> 
              
            </div>
        </footer>
      </div>

    </div>
  </div>
</div>