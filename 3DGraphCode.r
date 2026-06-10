my_data <- read_excel("C:\Users\tsery\Documents\Research Data\Demographics_Study.xlsx")
my_data <- read_excel("C:\Users\tsery\Documents\Research Data\Demographics_Study.xlsx")
install.packages("readxl")
library(readxl)
my_data <- read_excel("C:\Users\tsery\Documents\Research Data\Demographics_Study.xlsx")
my_data <- read_excel("C:/Users/tsery/Documents/Research Data/Demographics_Study.xlsx")
my_data
install.packages("plotly")
library(plotly)
library(plotly)
my_data$Young_Growth_Rate <-
((my_data$Young_2025 - my_data$Young_2024) / my_data$Young_2024) * 100
my_data[, c("State", "Young_2024", "Young_2025", "Young_Growth_Rate", "Distance")]
library(dplyr)
my_data <- my_data %>%
mutate(
Young_Growth_Rate = ((Young_2025 - Young_2024) / Young_2024) * 100
)
library(plotly)
plot_ly(
data = my_data,
x = ~State,
y = ~Young_Growth_Rate,
z = ~Distance,
color = ~Young_Growth_Rate,
text = ~paste(
"State:", State,
"<br>Young Growth Rate:", round(Young_Growth_Rate, 2), "%",
"<br>Distance:", Distance
),
hoverinfo = "text",
type = "scatter3d",
mode = "markers"
) %>%
layout(
scene = list(
xaxis = list(title = "State"),
yaxis = list(title = "Young Population Growth Rate (%)"),
zaxis = list(title = "Distance")
)
)
library(plotly)
plot_ly(
data = my_data,
x = ~State,
y = ~Young_Growth_Rate,
z = ~Distance,
color = ~Young_Growth_Rate,
text = ~State,
type = "scatter3d",
mode = "markers+text",
textposition = "top center"
) %>%
layout(
scene = list(
xaxis = list(title = "State"),
yaxis = list(title = "Young Population Growth Rate (%)"),
zaxis = list(title = "Distance")
)
)
plot_ly(
data = my_data,
x = ~State,
y = ~Young_Growth_Rate,
z = ~Distance,
color = ~Young_Growth_Rate,
text = ~State,
hovertext = ~paste(
"State:", State,
"<br>Young Growth Rate:", round(Young_Growth_Rate, 2), "%",
"<br>Distance:", Distance
),
hoverinfo = "text",
type = "scatter3d",
mode = "markers+text",
textposition = "top center"
)
