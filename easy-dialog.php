<style>
html{
  font-size: 12px;
}
input{
  border: none !important;
  background: white !important;
}
.form-control{
  border-radius: .25rem !important;
}

.btn-ctm1{
  background: linear-gradient(to bottom, #fd5500, #922b02);
  border: 0;
  border-radius: 0.5rem;
  color: white;
}
</style>
<div id="easyDialog" style="background-image: linear-gradient(to bottom, #ec6625, #3E313E);">
    <div v-if="loading || waiting" id="overlay">
      <div class="cv-spinner">
        <span class="spinner"></span>
      </div>
    </div>
    <div v-if="!loading" class="container">
        <div class="row py-3">
            <div class="col-lg-5 mb-2 mb-lg-0">
                <div class="row">
                    <div class="col-6">
                        <div class="input-group">
                            <input type="text" class="form-control border-0 rounded-3 me-2" @change="loadBot" v-model="loadingBotId" placeholder="Bot Name ...">
                            <button class="btn text-white border border-white rounded" type="button" @click="loadBot">Load</button>
                        </div>
                    </div>
                    <div class="col-6">
                        <div class="col-6 input-group">
                            <input type="text" class="form-control border-0 rounded-3 me-2" @change="saveBot" v-model="savingBotId" placeholder="Bot Name ...">
                            <button class="btn text-white border border-white rounded" @click="saveBot" type="button">Save</button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-2">
            </div>
            <div class="col-lg-5">
                <div class="row">
                    <div class="col-6">
                        <a href="https://easydialog.org/easybot-design-and-run-ai-bots-fast/" class="btn btn-ctm1 d-block shadow" target="[_blank]">Help / How-To</a>
                    </div>
                    <div class="col-6 d-grid">
                        <button class="btn btn-ctm1 shadow">Own Your Bot</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-6 pt-2">
                <span class="h4 text-white">Bot Keys : </span>
                <span class="h4 text-white">{{ botKey }} </span>
            </div>
            <div class="col-6 text-end">
                <button class="btn btn-ctm1 shadow mb-2" @click="buildBot">Build easyBot</button>
            </div>
        </div>

        <div class="">
            <div class="">
                <div class="row border-bottom">
                    <div class="col-4"><h3 class="p-2 mt-2 mb-0 text-white">Human Says : </h3></div>
                    <div class="col-4"><h3 class="p-2 mt-2 mb-0 text-white">AI Says : </h3></div>
                    <div class="col-4"><h3 class="p-2 mt-2 mb-0 text-white">AI Does : </h3></div>
                </div>
            </div>
            <div class="p-2" style="height: 600px; overflow-y: auto; overflow-x: hidden;">
              <div v-for="(card, index) in cards" :key="index">
                <new-box v-if="newStepPosition == card.id" :prev-card-action="cards[index - 1]?.action"></new-box>
                <div class="row mb-1">
                    <div class="col-4">
                        <card-hs v-if="card.action == 'hs'" :card="card" :is-insert="newStepPosition == card.id" :is-last="index == (cards.length - 1)"></card-hs>
                    </div>
                    <div class="col-4">
                        <card-as v-if="card.action == 'as'" :card="card" :is-insert="newStepPosition == card.id" :is-last="index == (cards.length - 1)"></card-as>
                    </div>
                    <div class="col-4">
                        <card-ad v-if="card.action == 'ad'" :card="card" :is-insert="newStepPosition == card.id" :is-last="index == (cards.length - 1)"></card-ad>
                    </div>
                </div>
              </div>
              <new-box v-if="!newStepPosition" :prev-card-action="cards[cards.length - 1]?.action"></new-box>
            </div>
        </div>

        <div class="py-3 d-flex align-items-center">
            <h5 class="me-3 mb-0 text-white">Register Similar Words :</h5>
            <div class="input-group" style="width: 400px;">
                <input type="file" class="form-control" id="inputGroupFile04" aria-describedby="inputGroupFileAddon04" aria-label="Upload">
                <button class="btn btn-secondary" type="button" id="inputGroupFileAddon04">Send</button>
            </div>
            <button class="btn btn-secondary rounded-circle ms-2 text-bold">?</button>
        </div>
    </div>

    <div class="modal fade" id="nextStepModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel">Select</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <select class="form-control" v-model="next">
              <option v-for="id in boxes.map(i => i.id)" value="id">{{id}}</option>
            </select>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            <button type="button" class="btn btn-primary" @click="setNext(row.id)">Save changes</button>
          </div>
        </div>
      </div>
    </div>

</div>

<script type="text/x-template" id="card-hs-template">
    <div>
        <the-card>
          <div class="d-md-flex justify-content-between mb-1">
            <h6 class="mb-0 ps-2 text-white">#{{card.id}}</h6>
            <div>
                <template v-if="card.next=='0'">
                  <change-next-btn :id="card.id"/>
                  <div class="modal fade" id="nextStepModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Select</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <select class="form-control" v-model="next">
                            <option v-for="id in $store.state.boxes.map(i => i.id)" :value="id">{{id}}</option>
                          </select>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" class="btn btn-primary" @click="setNext()">Save changes</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <template v-if="isInsert">
                  <remove-step-btn/>
                </template>
                <template v-else>
                  <new-step-btn :id="card.id"/>
                </template>
            </div>
          </div>
              <draggable class="row" v-model="cases" @start="drag=true" @end="drag=false" :move="onMove">
                <div v-for="(i, index) in cases" class="col-md-6" :key="index">
                    <the-card-case :content="i.content" :active="i.active" :action="card.action" :box-id="card.id" :case-id="index" :casesLength="card.cases.length">
                    </the-card-case>
                </div>
              </draggable>
          <input class="form-control form-control-sm" type="text" placeholder="Add New ..."
              @change="addCaseToCard(card.id, $event)"
          >
          <div class="d-md-flex justify-content-end align-items-center mt-2">
              <div class="">
                  <div v-if="card.next && isLast">
                      <h6>Next step: <strong> #{{ card.next}}</strong></h6>
                  </div>
              </div>
          </div>
        </the-card>
    </div>
</script>

<script type="text/x-template" id="card-as-template">
    <div>
        <the-card>
          <div class="d-md-flex justify-content-between mb-1">
            <h6 class="mb-0 ps-2 text-white">#{{card.id}}</h6>
            <div>
                <template v-if="card.next == '0'">
                  <change-next-btn :id="card.id"/>
                  <div class="modal fade" id="nextStepModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Select</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <select class="form-control" v-model="next">
                            <option v-for="id in $store.state.boxes.map(i => i.id)" :value="id">{{id}}</option>
                          </select>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" class="btn btn-primary" @click="setNext()">Save changes</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <new-image-btn :id="card.id"/>
                <template v-if="isInsert">
                  <remove-step-btn/>
                </template>
                <template v-else>
                  <new-step-btn :id="card.id"/>
                </template>
            </div>
          </div>
            <div v-for="(i, index) in card.cases" :key="index">
                <the-card-case :content="i.content" :active="i.active" :box-id="card.id" :case-id="index">
                </the-card-case>
            </div>

            <div
              v-if="card.doc"
              style="
                height: 70px;
                margin: 3px 0;
                border: 1px solid white;
                background: black;
                background-size: contain;
                background-repeat: no-repeat;
                background-position: center center;"
              :style="'background-image: url(\'' + card.doc + '\');'"
            ></div>
            <div class="d-md-flex justify-content-end align-items-center mt-2">
                <div class="">
                    <div v-if="card.next && isLast">
                        <span>Next step: <strong> #{{ card.next}}</strong></span>
                    </div>
                </div>

            </div>
        </the-card>
    </div>
</script>

<script type="text/x-template" id="card-ad-template">
    <div :key="renderKey">
        <the-card>
          <div class="d-md-flex justify-content-between mb-1">
            <h6 class="mb-0 ps-2 text-white">#{{card.id}}</h6>
            <div>
                <template v-if="card.next == '0'">
                  <change-next-btn :id="card.id"/>
                  <div class="modal fade" id="nextStepModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div class="modal-dialog">
                      <div class="modal-content">
                        <div class="modal-header">
                          <h5 class="modal-title" id="exampleModalLabel">Select</h5>
                          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                          <select class="form-control" v-model="next">
                            <option v-for="id in $store.state.boxes.map(i => i.id)" :value="id">{{id}}</option>
                          </select>
                        </div>
                        <div class="modal-footer">
                          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                          <button type="button" class="btn btn-primary" @click="setNext()">Save changes</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>
                <new-script-btn :id="card.id"/>
                <template v-if="isInsert">
                  <remove-step-btn/>
                </template>
                <template v-else>
                  <new-step-btn :id="card.id"/>
                </template>
            </div>
          </div>
            <div class="row">
                <div class="col-6">
                    <div class="btn-group d-grid">
                      <button type="button" class="btn bg-primary text-white dropdown-toggle text-start arrow-none btn-sm " data-bs-toggle="dropdown" aria-expanded="false">
                        {{ activeContent[0] }}
                      </button>
                      <span
                          @click.stop=""
                          style="cursor: pointer;right: 0.25em; top: 0.25em; color: white; z-index: 2;"
                          class="position-absolute"
                          @click="deleteBox"
                      >×</span>
                      <ul class="dropdown-menu">
                        <li class="p-1"><input type="text" class="form-control-sm" @change="changeAdMain" placeholder="Add New ..."></li>
                        <li><hr class="dropdown-divider"></li>
                        <li v-for="(main, index) in mains" :key="index">
                          <span class="dropdown-item" @click="activeAdMain(main)">{{main}}</span>
                        </li>
                      </ul>
                    </div>
                </div>
                <div class="col-6">
                    <div class="btn-group d-grid">
                      <button type="button"
                        class="dropdown-toggle btn bg-primary text-white  text-start arrow-none btn-sm "
                        data-bs-toggle="dropdown" aria-expanded="false"
                      >
                        {{ activeContent[1] }}
                      </button>
                      <ul class="dropdown-menu">
                        <li class="p-1"><input type="text" class="form-control-sm" @change="addAdSub" placeholder="Add New ..."></li>
                        <li><hr class="dropdown-divider"></li>
                        <li v-for="sub in subs(activeContent[0])">
                          <span class="dropdown-item mb-1 d-flex justify-content-between"
                            :class="{ 'bg-primary' : caseSubs.includes(sub)}"
                            @click="activateOrPushCase(sub)"
                          >
                            <span>{{ sub }}</span>
                            <template v-if="caseSubs.includes(sub)">
                              <span
                                @click.stop="deleteCase(sub)"
                                style="cursor: pointer;"
                              >×</span>
                            </template>
                          </span>
                        </li>
                      </ul>
                    </div>
                </div>
            </div>
            <div class="d-md-flex justify-content-end align-items-center mt-2">
                <div class="">
                    <div v-if="card.next && isLast">
                        <span>Next step: <strong> #{{ card.next}}</strong></span>
                    </div>
                </div>

            </div>
        </the-card>
    </div>
</script>

<!-- new-box Component -->
<script type="text/x-template" id="new-box-template">
    <div class="row py-1" :key='renderKey'>
        <div class="col-4">
            <input type="text" class="form-control focusElement rounded-3 border-0 inputing" placeholder="Type Human Sentence"
              @change="addNewBox('hs', $event)"
              v-if="prevCardAction != 'hs'"
            >
        </div>
        <div class="col-4">
            <input type="text" class="form-control rounded-3 border-0 inputing" placeholder="Type AI Sentence"
              @change="addNewBox('as', $event)"
              v-if="prevCardAction != 'as'"
            >
        </div>
        <div class="col-4">
          <div class="row"  v-if="prevCardAction != 'ad'">
            <div class="col-6">
              <div class="btn-group d-grid">
                <button type="button" class="btn bg-white dropdown-toggle text-start arrow-end btn border" data-bs-toggle="dropdown" aria-expanded="false">
                  Select Main
                </button>
                <ul class="dropdown-menu">
                  <li class="p-1"><input type="text" class="form-control" @change="addNewBox('ad', $event)" placeholder="Add New ..."></li>
                  <li><hr class="dropdown-divider"></li>
                  <li v-for="main in mains">
                    <span class="dropdown-item" @click="selectMain('ad', main)">{{main}}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
    </div>
</script>

<script type="text/x-template" id="the-card-template">
    <div class="">
        <slot></slot>
    </div>
</script>

<script type="text/x-template" id="the-card-button-template">
    <button class="btn btn-outline-light p-0 px-1" :title="title">
        <slot></slot>
    </button>
</script>

<script type="text/x-template" id="change-next-btn-template">
    <button class="btn btn-outline-light p-0 px-1"
      title="Change Next Step"
      data-bs-toggle="modal" data-bs-target="#nextStepModal"
    >
        <i class="bi-chevron-bar-right"></i>
    </button>
</script>

<script type="text/x-template" id="new-step-btn-template">
    <button class="btn btn-outline-light p-0 px-1" title="Insert New Step Before This Step"
      @click="clickHandler"
    >
      +
    </button>
</script>

<script type="text/x-template" id="remove-step-btn-template">
    <button class="btn btn-outline-light p-0 px-1" title="Remove This New Step"
      @click="clickHandler"
    >
      -
    </button>
</script>

<script type="text/x-template" id="new-image-btn-template">
  <span>
    <input
      type="file" hidden
      ref="photo"
      style="visibility:hidden; height: 0;"
      @change="updateImage"
    >
    <button class="btn btn-outline-light p-0 px-1" title="Upload Image File"
      @click="clickHandler"
    >
        <i class="bi-image"></i>
    </button>
  </span>
</script>

<script type="text/x-template" id="new-script-btn-template">
  <span>
    <input
      type="file" hidden
      ref="photo"
      style="visibility:hidden; height: 0;"
      @change="updateImage"
    >
    <button class="btn btn-outline-light p-0 px-1" title="Upload Script File"
      @click="clickHandler"
    >
        <i class="bi-file-text"></i>
    </button>
  </span>
</script>

<script type="text/x-template" id="the-card-case-template">
    <div class="position-relative bg-gradient px-2 py-1 text-light d-flex justify-content-between align-items-center mb-1" :class="active?'bg-primary':'bg-secondary'">
        <div class="w-100" @click="handleClick">
            {{content}}
        </div>
        <textarea
            v-if="editing"
            class="position-absolute top-100 start-0 w-100 form-control" style="z-index: 2;"
            @blur="changeEventHandler($event)"
            @change="changeEventHandler($event)"
            @keypress.enter.prevent="changeEventHandler($event)"
        >{{content}}</textarea>
        <span class="text-white" style="cursor: context-menu;" @click="removeEventHandler()">×</span>
    </div>
</script>
