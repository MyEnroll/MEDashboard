<template>
  <fusioncharts
    :type="type"
    :width="width"
    :height="height"
    :dataFormat="dataFormat"
    :dataSource="dataSource"
  ></fusioncharts>
</template>
<script>
import Vue from "vue";

Vue.component("fusioncharts");
export default {
  name: "detailWidget",
  data() {
    return {
      type: "angulargauge",
      renderAt: "widget-container",
      width: "100%",
      height: "400",
      dataFormat: "json",
      dataSource: {
        chart: {
          lowerLimit: "0",
          theme: "fusion",
          showToolTip: "1",
          showTickValues: false,
          showTickMarks: false,
          animation: true,
          showValue: true
        },
        point: {
          thickness: 20,
          valueInside: true,
          displayValue: "Test"
        },
        colorRange: {
          color: [
            {
              minValue: "0",
              maxValue: "75",
              code: "#1e87f0"
            },
            {
              minValue: "75",
              maxValue: "200",
              code: "#1e1e1e",
              alpha: 10
            }
          ]
        },
        annotations: {
          groups: [
            {
              items: [
                //     {
                //     "id": "1",
                //     "type": "text",
                //     "text": yearDetail,
                //     "align": "left",
                //     "font": "Nunito Sans",
                //     "bold": "0",
                //     "fontSize": "14",
                //     "color": "#FDFDFD",
                //     "x": "$chartStartX + 15",
                //     "y": "$chartEndY - 20"
                // },
                {
                  id: "2",
                  type: "text",
                  text: 100,
                  align: "center",
                  font: "Nunito Sans",
                  bold: "1",
                  fontSize: "45",
                  color: "#FDFDFD",
                  x: "$chartcenterX",
                  y: "$chartCenterY"
                },
                {
                  id: "3",
                  type: "text",
                  text: "kWh/Sqft",
                  align: "center",
                  font: "Nunito Sans",
                  bold: "0",
                  fontSize: "25",
                  color: "#FDFDFD",
                  x: "$chartcenterX",
                  y: "$chartCenterY + 45"
                }
              ]
            }
          ]
        },
        dials: {
          dial: [
            {
              value: 100,
              alpha: "0",
              borderAlpha: "0",
              radius: "0",
              baseRadius: "0",
              rearExtension: "0",
              baseWidth: "0",
              showValue: "0"
            }
          ]
        }
      }
    };
  }
};
</script>
