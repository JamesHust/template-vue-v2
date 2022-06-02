<template>
    <div class="Ontology fci-page">
        <!--header-->
        <div class="d-flex align-center justify-space-between header-page">
            <div class="d-flex align-center">
                <strong style="font-size: 24px; margin-right: 10px">Ontology</strong>
                <div class="d-flex align-center">
                    <div class="d-flex align-center justify-center btn-zoom"><img src="/img/template/zoom-out.svg"/></div>
                    <div class="zoom-box">
                        <v-select
                                v-model="zoom"
                                :items="zoomList"
                                item-text="text"
                                item-value="value"
                                single-line
                                dense
                                outlined
                                hide-details
                        ></v-select>
                    </div>
                    <div class="d-flex align-center justify-center btn-zoom"><img src="/img/template/zoom-in.svg"/></div>
                </div>
            </div>
            <div class="d-flex align-center">
                <div style="font-size: 14px; color: #434343">10 {{$t('entityTypes')}} - 10 {{$t('relationships')}}</div>
                <v-btn color="primary" class="btn-custom">
                    <img
                            src="/img/template/add.svg"
                            alt="icon_add_entity"
                            style="margin-right: 6px; transform: scale(0.9)"
                    >
                    {{ $f.tc('addEntityType') }}
                </v-btn>
                <v-btn color="primary" class="btn-custom">
                    <img
                            src="/img/template/ontology.svg"
                            alt="icon_add_relationship"
                            style="margin-right: 6px; transform: scale(0.9)"
                    >
                    {{ $f.tc('addRelationship') }}
                </v-btn>
            </div>
        </div>
        <!--ontology-->
        <div>
            <OntologyView></OntologyView>
        </div>
    </div>
</template>

<script>

import OntologyView from '@/views/Project/Ontology/OntologyView'
const zoomList = [
    {
        text: '25%',
        value: 25
    },
    {
        text: '50%',
        value: 50
    },
    {
        text: '75%',
        value: 75
    },
    {
        text: '100%',
        value: 100
    },
    {
        text: '125%',
        value: 125
    },
    {
        text: '150%',
        value: 150
    }
]
export default {
    name: 'Ontology',
    components: { OntologyView },
    data () {
        return {
            zoom: 100,
            zoomList
        }
    }
    // methods: {
    //
    // },
}
</script>

<style scoped lang="scss">
.Ontology {
  background: #fff;
  height: calc(100vh - 64px);
  overflow-y: auto;
}

.header-page {
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.08);
  padding: 12px;
}

.zoom-box {
  width: 58px;

  ::v-deep .v-input__icon--append {
    display: none;
  }

  ::v-deep .v-input__slot {
    padding: 0 10px !important;
    height: 30px !important;
    min-height: 30px !important;
    font-size: 14px !important;
    border-radius: 0 !important;
  }

  ::v-deep .v-select.v-text-field input {
    display: none;
  }

  ::v-deep .v-select.v-input--dense .v-select__selection--comma {
    margin: 0 !important;
  }

  ::v-deep .v-select__selections {
    justify-content: center;
  }

  ::v-deep .v-input__append-inner {
    padding-left: 0 !important;
  }

  ::v-deep .theme--light.v-text-field--outlined:not(.v-input--is-focused):not(.v-input--has-state)>.v-input__control>.v-input__slot fieldset {
    color: #D1D1D1 !important;
  }
}

.btn-zoom {
  height: 30px;
  width: 30px;
  border: 1px solid #D1D1D1;
  cursor: pointer;

  &:hover {
    background: #D1D1D1;
  }

  &:first-child {
    border-radius: 5px 0 0 5px;
    border-right: none;
  }

  &:last-child {
    border-radius: 0 5px 5px 0;
    border-left: none;
  }
}

.btn-custom {
  text-transform: inherit !important;
  font-weight: 400;
  padding: 8px 12px !important;
  font-size: 14px;
  height: 30px !important;
  margin-left: 10px;
}
</style>
