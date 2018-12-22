			//获取当前日期(a)的前（n）小时的日期对象
			function getPreTime(a,n){
				var timeCount =a.getTime();
				timepreDay = timeCount -n*1000*60*60;
				return new Date(timepreDay);
			}
			//获取当前日期(a)的前（n）天的日期对象
			function getPreDay(a,n){
				var timeCount =a.getTime();
				timepreDay = timeCount -n*1000*60*60*24;
				return new Date(timepreDay);
			}
			
			//获取当前日期（a）的前（n）月的日期对象;
			function getPreMonth(a,n){
				var year = a.getFullYear();
				var month = a.getMonth()+1;
				var day = a.getDate();
				//如果要减去的月份比当前月份值大，则用12月份，去减去多余的月份
				if(n>month){
					year--;
					var nb = n-month;
					month = 12-nb;
				}else if(n==month){
					year--;
					month=12;
					
				}else{
						month -=n ;
					}
				if(month<10){
					month = '0'+month;
				}
				if(day<10){
					day ='0'+day;
				}
				
				var da = new Date(year+"/"+month+"/"+day);
				 if (da.getDate() != a.getDate()) { da.setDate(0); }
				return da
			}
			
			//获取当前日期（a）的前（n）年的日期对象;
			function getPreYear(a,n){
				var year = a.getFullYear();
				var month = a.getMonth()+1;
				var day = a.getDate();
				if(month<10){
					month ='0'+month;
				}
				if(day<10){
					day ='0'+day;
				}
				var da = new Date(year-n+"/"+month+"/"+day);
				return da
			}
			//给日期对象进行格式转化为‘2012-01-01 12:10:10’格式
			function getFullFormat(a){
				//先获取每个时间单位数据
				var year = a.getFullYear();
				var month = a.getMonth()+1;
				var day = a.getDate();
				var hour = a.getHours();
				var mm = a.getMinutes();
				var ss = a.getSeconds();
				//进行单位补零
				if(month<10){
					month ='0'+month;
				}
				if(day<10){
					day ='0'+day;
				}
				if(hour<10){
					hour ='0'+hour;
				}
				if(mm<10){
					mm ='0'+mm;
				}
				if(ss<10){
					ss ='0'+ss;
				} 
				//拼出相应的格式字符串
				var da = year+"-"+month+"-"+day +" "+hour+":"+mm+":"+ss;
				return da;
				
			}
			//给日期进行格式转化为‘2012-01-01 12’格式
			function getTimeFormat(a){
				//先获取每个时间单位数据
				var year = a.getFullYear();
				var month = a.getMonth()+1;
				var day = a.getDate();
				var hour = a.getHours();
				//进行单位补零
				if(month<10){
					month ='0'+month;
				}
				if(day<10){
					day ='0'+day;
				}
				if(hour<10){
					hour ='0'+hour;
				}
				//拼出相应的格式字符串
				var da = year+"-"+month+"-"+day +" "+hour;
				return da;
				
			}
			//给日期进行格式转化为‘2012-01-01’格式
			function getDateFormat(a){
				var year = a.getFullYear();
				var month = a.getMonth()+1;
				var day = a.getDate();
				if(month<10){
					month ='0'+month;
				}
				if(day<10){
					day ='0'+day;
				}
				var da = year+"-"+month+"-"+day;
				return da;
				
			}
			//给日期进行格式转化为‘2012-01’格式
			function getMonthFormat(a){
				var year = a.getFullYear();
				var month = a.getMonth()+1;
				var day = a.getDate();
				if(month<10){
					month ='0'+month;
				}
				if(day<10){
					day ='0'+day;
				}
				var da = year+"-"+month;
				return da;
				
			}
			//给日期进行格式转化为‘2012’格式
			function getYearFormat(a){
				var year = a.getFullYear();
				var month = a.getMonth()+1;
				var day = a.getDate();
				if(month<10){
					month ='0'+month;
				}
				if(day<10){
					day ='0'+day;
				}
				var da = year;
				return da;
				
			}
			//将‘2012-01-01 12:10:00’格式的字符串转化为日期对象
			function getFullObject(str){
				var dt = str.split(" ");
				var dateStr = dt[0].split("-");
				var timeStr = dt[1].split(":");
				var da = new Date(dateStr[0],dateStr[1]-1,dateStr[2],timeStr[0],timeStr[1],timeStr[2]);
				return da;
			}
			//将‘2012-01-01 12’格式的字符串转化为日期对象(分秒默认为0)
			function getTimeObject(str){
				var dt = str.split(" ");
				var dateStr = dt[0].split("-");
				var da = new Date(dateStr[0],dateStr[1]-1,dateStr[2],dt[1],'00','00');
				return da;
			}
			//将‘2012-01-01’格式的字符串转化为日期对象
			function getDateObject(str){
				var dt = str.split("-");
				var da = new Date(dt[0],dt[1]-1,dt[2]);
				return da;
			}
			//将‘2012-01’格式的字符串转为日期对象,默认日期为当月第一天
			function getMonthObject(str){
				var dt = str.split("-");
				var da = new Date(dt[0],dt[1]-1,"01");
				return da;
			}
			//将‘2012’格式的字符串转为日期对象,默认日期为当年第一个月第一天
			function getYearObject(str){
				//var dt = str.split("-");
				var da = new Date(str,"00","01");
				return da;
			}
			//通过第一个天日期字符串（str）得到当月的最后一天的日期对象
			function getLastMonth(str){
				var dt = str.split("-");
				var year = parseInt(dt[0]);
				var month = parseInt(dt[1]);
				var day  = parseInt(dt[2]);
				var mon;
				//先判断是否是二月，然后再判断是大小月，对应生成该月的最后一天
				if(month==2){
					//再判断是否是闰年，若是即为29天，不是则为28天
					if(year%4==0&&year%100!=0||year%400==0){
						 mon = new Date(dt[0],"01","29");
					}else{
						mon = new Date(dt[0],"01","28");
					}
				}else if(month==1||month==3||month==5||month==7||month==8||month==10||month==12){
					mon = new Date(dt[0],dt[1]-1,"31");
				}else{
					mon = new Date(dt[0],dt[1]-1,"30");
				}
				
				return mon;
			}
			//通过第一个天日期字符串（str）得到当年的最后一天的日期对象
			function getLastYear(str){
				var dt = str.split("-");
				var year = new Date(dt[0],"11","31");
				return year;
			}
			//返回上个季度值
			function startSeason(season)
			{   
			  	if(season == '01')
			  	{
			  		return '04';
			  	}else if(season == '02')
			  	{
			  		return '01';
			  	}else if(season == '03')
			  	{
			  		return '02';
			  	}else if(season == '04')
			  	{
			  		return '03';
			  	}
			}
			
			//根据季度值返回年份
			function startYear(season,date)
			{   
				if(season == '01')
			  	{
			  		return getPreYear(date,1);
			  	}
				else 
			  	{
			  		return date;
			  	}
			}
			//月份是一位数的前面补 0
			function getMonthStr(date)
			{
				var month = date.getMonth();
				if(month<9){
					month ='0'+(month+1);
				}
				else
				{
					month = month+1;
				}
				return month;
			}
			
			
//特殊类型的时间格式要求（相互转化）
			//给日期进行格式转化为‘201201’格式
			function getTeFormat(a){
				var year = a.getFullYear();
				var month = a.getMonth()+1;
				var day = a.getDate();
				if(month<10){
					month ='0'+month;
				}
				var da = year+""+month;
				return da;
				
			}
			//将‘201201’格式的字符串转为日期对象,默认日期为当月第一天
			function getTeObject(str){
				var y = str.substring(0,4);
				var m = str.substring(4,6);
				var da = new Date(y,parseInt(m)-1,"01");
				return da;
			}