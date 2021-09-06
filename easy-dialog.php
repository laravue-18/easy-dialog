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
              <div class="asRow">
                <div class="rowNumber">
                  <template v-if="isInsert == 's'">
                    <button style="border-radius: 9999px;" @click="insertRow('n')">-</button>
                  </template>
                  <template v-else>
                    <button style="border-radius: 9999px;" @click="insertRow('s')">+</button>
                  </template>
                </div>
                <template v-if="isInsert == 's'">
                  <div class="rowBody">
                      <div class="asBox">
                          <template v-if="rows()[0]['action'] != 'hs'">
                              <input class="focusElement" type="text" placeholder="type human sentence" :value="text" @change="addHsNewBox(prev_row_id, $event)">
                          </template>
                      </div>
                      <div class="asBox">
                        <template 
                          v-if="rows()[0]['action'] != 'as'"
                        >
                          <input class="focusElement" type="text" placeholder="type AI sentence" :value="text" @change="addAsNewBox(prev_row_id, $event)" @click="adClick">
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
                        <div class="adBox-qwer">
                          <template 
                            v-if="rows()[0]['action'] != 'ad'"
                          >
                            <div class="asBoxSub">
                              <input type="text" placeholder="Select Main" readonly @click="adClick">
                              <div class="dropList">
                                <input 
                                  type="text" 
                                  placeholder="add name of new library" 
                                  @change="addAdMain(false, $event)"
                                >
                                <hr>
                                <div 
                                  class="adItem" 
                                  v-for="i in ad_mains()"
                                >
                                    <input 
                                      type="text" 
                                      :value="i" 
                                      @click="activeAdMain(false, $event)" 
                                      readonly
                                    >
                                    <!-- <span 
                                      class="removeMark" 
                                      @click.stop.prevent="deleteAdMain(i)"
                                    >
                                      ×
                                    </span> -->
                                </div>
                              </div>
                            </div>
                            <div class="asBoxSub">
                                <input type="text" placeholder="Select Sub" readonly>
                            </div>
                          </template>
                        </div>
                      </div>
                  </div>
                </template>
              </div>
              <template v-for="(row, index) in rows()" :key="index">
                <div class="asRow">
                  <div class="rowNumber">
                    <template v-if="row.id == isInsert.id">
                      <button @click="insertRow(row)">-</button>
                    </template>
                    <template v-else>
                      <button @click="insertRow(row)">+</button>
                    </template>
                  </div>
                  <div class="rowBody">
                    <template v-if="row.action == 'hs'">
                      <div class="asBox">
                        <div 
                          v-for="(i, idx) in box(row.id).cases"
                          class="hsCase" 
                          :class="{active: i.content == hs_active[row.id]}"
                          @click.stop.prevent = "activeHsCase(row, i, $event)"
                        >
                          <input
                            class="listItem"
                            type="text"
                            :value = "i.content"
                            @dblclick="changeHsCase(row, i, $event)"
                            readonly
                          >
                          <span class="removeMark" @click.stop.prevent="deleteCase(row, i.content == hs_active[row.id], idx)">×</span>
                        </div>
                        <input type="text" placeholder="type human sentence" :value="text" @keyup.enter="addHsNewCase(row.id, $event)">
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
                          @change="updatePhotoPreview(row, $event)"
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
                          <div class="adBox-qwer">
                              <div class="asBoxSub">
                                  <div style="background: #fe5500; color: white; display:flex; ">
                                    <input type="text" 
                                        :value="ad_active[row.id][0]" 
                                        placeholder="Select Main" 
                                        @click="adClick"
                                        style="background: #fe5500; color: white;"
                                        readonly>
                                    <span class="removeMark" @click.stop.prevent="deleteCase(row)">×</span>
                                    <div class="dropList">
                                        <input type="text" placeholder="add name of new library" @change="addAdMain(row, $event)">
                                        <hr>
                                        <template v-for="i in ad_mains()">
                                            <div :class="isActiveAdMain(i, row.id) ? 'adItem active' : 'adItem'">
                                                <input type="text" :value="i" @click="activeAdMain(row, $event)" readonly>
                                                <!-- <span class="removeMark" @click.stop.prevent="deleteAdMain(i)">×</span> -->
                                            </div>
                                        </template>
                                    </div>
                                  </div>
                              </div>
                              <div class="asBoxSub">
                                <input 
                                  type="text" 
                                  :value="ad_active[row.id][1]" 
                                  placeholder="Select Main" 
                                  @click="adClick"
                                  style="background: #fe5500; color: white"
                                  readonly
                                >
                                <div class="dropList">
                                  <input 
                                    type="text" 
                                    placeholder="add name of new library" 
                                    @change="addAdSub(row, $event)"
                                  >
                                  <hr>
                                  <template v-for="i in ad_subs(ad_active[row.id][0])">
                                    <div 
                                      class="adItem" 
                                      :style="isActiveAdSub(i, row.id) ? 'background:  #fe5500;' : ''"
                                    >
                                      <input 
                                        type="text" 
                                        :value="i" @click="activeAdSub(row, $event)" 
                                        readonly
                                      >
                                      <span 
                                        class="removeMark" 
                                        @click.stop.prevent="deleteAdSub(ad_active[row.id][0], i)"
                                      >
                                        ×
                                      </span>
                                    </div>
                                  </template>
                                </div>
                              </div>
                          </div>
                          <div class="mt-2" v-if="getScript(row)">
                            <div style="background: white; margin-top:2px; border-radius: 2px;">
                              {{ getScript(row) }}
                            </div>
                          </div>
                          <input 
                            type="file" hidden
                            ref="photo"
                            style="visibility:hidden; height: 0;"
                            @change="updateScript(row, $event)"
                          >
                          <button
                            @click="selectNewScript"
                            style="
                              margin: 3px;
                              padding: 5px 10px;
                              border-radius: 9999px;
                              height: 2.2em;"
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
                    </template>
                  </div>
                </div>
                <template v-if="row.id == isInsert.id">
                  <div class="asRow">
                    <div class="rowNumber">
                      <input type="text" :value="rows().length + 1">
                    </div>
                    <div class="rowBody">
                        <div class="asBox">
                            <template v-if=" row.action != 'hs' ">
                                <input class="focusElement" type="text" placeholder="type human sentence" :value="text" @change="addHsNewBox(prev_row_id, $event)">
                            </template>
                        </div>
                        <div class="asBox">
                          <template 
                            v-if=" row['action'] != 'as' "
                          >
                            <input class="focusElement" type="text" placeholder="type AI sentence" :value="text" @change="addAsNewBox(prev_row_id, $event)" @click="adClick">
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
                          <div class="adBox-qwer">
                            <template 
                              v-if="row['action'] != 'ad'"
                            >
                              <div class="asBoxSub">
                                <input type="text" placeholder="Select Main" readonly @click="adClick">
                                <div class="dropList">
                                  <input 
                                    type="text" 
                                    placeholder="add name of new library" 
                                    @change="addAdMain(false, $event)"
                                  >
                                  <hr>
                                  <div 
                                    class="adItem" 
                                    v-for="i in ad_mains()"
                                  >
                                      <input 
                                        type="text" 
                                        :value="i" 
                                        @click="activeAdMain(false, $event)" 
                                        readonly
                                      >
                                      <!-- <span 
                                        class="removeMark" 
                                        @click.stop.prevent="deleteAdMain(i)"
                                      >
                                        ×
                                      </span> -->
                                  </div>
                                </div>
                              </div>
                              <div class="asBoxSub">
                                  <input type="text" placeholder="Select Sub" readonly>
                              </div>
                            </template>
                          </div>
                        </div>
                    </div>
                  </div>
                </template>
              </template>
              <template v-if="!isInsert && (isInsert != 's')">
                <div class="asRow">
                  <div class="rowNumber">
                    <input type="text" :value="rows().length + 1">
                  </div>
                  <div class="rowBody">
                      <div class="asBox">
                          <template v-if="rows().length ? rows()[rows().length-1]['action'] != 'hs' : true">
                              <input class="focusElement" type="text" placeholder="type human sentence" :value="text" @change="addHsNewBox(prev_row_id, $event)">
                          </template>
                      </div>
                      <div class="asBox">
                        <template 
                          v-if="rows().length ? rows()[rows().length-1]['action'] != 'as' : true"
                        >
                          <input class="focusElement" type="text" placeholder="type AI sentence" :value="text" @change="addAsNewBox(prev_row_id, $event)" @click="adClick">
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
                        <div class="adBox-qwer">
                          <template 
                            v-if="rows().length ? rows()[rows().length-1]['action'] != 'ad' : true"
                          >
                            <div class="asBoxSub">
                              <input type="text" placeholder="Select Main" readonly @click="adClick">
                              <div class="dropList">
                                <input 
                                  type="text" 
                                  placeholder="add name of new library" 
                                  @change="addAdMain(false, $event)"
                                >
                                <hr>
                                <div 
                                  class="adItem" 
                                  v-for="i in ad_mains()"
                                >
                                    <input 
                                      type="text" 
                                      :value="i" 
                                      @click="activeAdMain(false, $event)" 
                                      readonly
                                    >
                                    <!-- <span 
                                      class="removeMark" 
                                      @click.stop.prevent="deleteAdMain(i)"
                                    >
                                      ×
                                    </span> -->
                                </div>
                              </div>
                            </div>
                            <div class="asBoxSub">
                                <input type="text" placeholder="Select Sub" readonly>
                            </div>
                          </template>
                        </div>
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
                <button 
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
                  </span>
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