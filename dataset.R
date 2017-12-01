rm(list=ls())

#Script to filter the merchants that changes of address in, at least, one of the years
#of the study (2014,2015,2016,2017 (snap shots in June)).

library("geocode")
library("RCurl")
library("RJSONIO")
library("plyr")
library("maptools")
library("stringr")
library("devtools")
library("extrafont")
library("ggthemes")
library("readr")
library("haven")
library("dplyr")
library("tidyr")
library("stringr")
library("ggplot2")
library("plyr")
library("ggrepel")
library("grid")
library("gridExtra")
library("gdata") 
library("readxl")
library("scales")
library("gtable")
library("ggmap")

# Import data
setwd("/Users/pedro/Documents/DataVis/Final_Project_D3/license_data")
jun_2014 = read.csv("jun_2014.csv")
jun_2015 = read.csv("jun_2015.csv")
jun_2016 = read.csv("jun_2016.csv")
jun_2017 = read.csv("jun_2017.csv")

#Clean
jun_2014$year = 2014
jun_2015$year = 2015
jun_2016$year = 2016
jun_2017$year = 2017

#Create addresses (using business name)
attach(jun_2014)
jun_2014$address <- paste(Premise.Street,",",Premise.City,",",Premise.State,",",Premise.Zip.Code,", US")
detach(jun_2014)

attach(jun_2015)
jun_2015$address <- paste(Premise.Street,",",Premise.City,",",Premise.State,",",Premise.Zip.Code,", US")
detach(jun_2015)

attach(jun_2016)
jun_2016$address <- paste(Premise.Street,",",Premise.City,",",Premise.State,",",Premise.Zip.Code,", US")
detach(jun_2016)

attach(jun_2017)
jun_2017$address <- paste(Premise.Street,",",Premise.City,",",Premise.State,",",Premise.Zip.Code,", US")
detach(jun_2017)

#KEEP LICENSES NAMES without repetition
unique_jun_2014 <- jun_2014[!(duplicated(jun_2014$License.Name) | duplicated(jun_2014$License.Name, fromLast = TRUE)), ]
unique_jun_2015 <- jun_2015[!(duplicated(jun_2015$License.Name) | duplicated(jun_2015$License.Name, fromLast = TRUE)), ]
unique_jun_2016 <- jun_2016[!(duplicated(jun_2016$License.Name) | duplicated(jun_2016$License.Name, fromLast = TRUE)), ]
unique_jun_2017 <- jun_2017[!(duplicated(jun_2017$License.Name) | duplicated(jun_2017$License.Name, fromLast = TRUE)), ]

#APPEND TABLES (one table is an snapshot of june of each year (2014,2015,2016,2017))
unique <- rbind(unique_jun_2014,unique_jun_2015,unique_jun_2016,unique_jun_2017)

#KEEP MERCHANTS (armories) that appear more the once in the dataset (between different years)
#Number of times that merchants repeat in the dataset (1 is having just one merchant: zero non sense)
table(table(unique$License.Name)) 
biz <- as.data.frame(table(unique$License.Name))
names(biz)[names(biz)=="Var1"] <- "License.Name"
#Merge with names to have the name frecuencies
unique <- join(unique,biz,by="License.Name", type = "left")
#Drop names that just appears once in the data
unique <- subset(unique, Freq>1)

# KEEP MERCHANTS with a change of address (one or more times during the 4 years)
#Order them by license name
unique <- unique[order(unique$License.Name),]
#Generate a dummie that indicate the number of different addresses within License Name
require(data.table)
setDT(unique)[, count := uniqueN(address), by = License.Name]
#Filter merchants that have same address in all the observations
merchants <- subset(unique, count>1)

# KEEP ;erchants with a interstatal change of address
require(data.table)
setDT(merchants)[, count_state := uniqueN(Premise.State), by = License.Name]
#Filter merchants that have addresses in the same state
merchants_state <- subset(unique, count_state>1)

#GEOCODE
#API To get long and lat
merchants_state <- mutate_geocode(merchants_state, address) 
merchants_state <- merchants_state[!is.na(merchants_state$lat),]
write.csv(merchants_state, file = "merchants_state.csv")

#RESULT:
#DATAFRAME WITH ARMORIES THAT CHANGE of address between years: merchants (without lat, long)
#DATAFRAME WITH ARMORIES THAT CHANGE of Interstate address between years: merchants_state (with lat, long)

#SOME TESTS
#Analysis of lengths
p_2014 <- mean(merchants_state$lat[merchants_state$year==2014])
p_2015 <- mean(merchants_state$lat[merchants_state$year==2015])
p_2016 <- mean(merchants_state$lat[merchants_state$year==2016])
p_2017 <- mean(merchants_state$lat[merchants_state$year==2017])

# Density waves
p1 <- ggplot(merchants_state, aes(lon,lat,color=factor(year))) 
p1 <- p1 + geom_density_2d() 
p1 <- p1 + glimpse(merchants_state) 
p1 <- p1 + facet_wrap(~year)
p1

#Number of merchants in each year
S
