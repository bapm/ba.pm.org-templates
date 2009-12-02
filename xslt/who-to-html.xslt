<?xml version="1.0" encoding="UTF-8"?>

<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns:html="http://www.w3.org/1999/xhtml"
	xmlns:ba="http://bratislava.pm.org/dtd/who-1.2.dtd"

	xmlns:exsl="http://exslt.org/common"
	extension-element-prefixes="exsl"
	exclude-result-prefixes="ba html"
>

<xsl:output 
	method="xml"
	indent="yes"
	omit-xml-declaration="yes"
/>


<!-- Import our nice utilities -->
<xsl:include href="utils.xslt"/>



<xsl:template match="/ba:who">
	
	[%
	META title          = "Kto je kto - Who's who";
	META description    = "Bratislava Perl Monger Kto je kto - Who's who";
	META keywords       = "Perl, Bratislava, kto, who";
	META inc_googlemaps = 1;
	%]
	
	<h1>Kto je kto - Who's who</h1>
	<p>Discover the Bratislava Perl mongers.</p>

	<!-- Short list of the mongers with a link to jump to the monger -->
	<table>
	<tr><td>
	<ul>
		<xsl:for-each select="ba:monger">
			<xsl:sort select="ba:name" order="ascending"/>
			
			<li>
				<xsl:choose>
					<xsl:when test="ba:geo">
						<a href="#{ba:id}" onclick="javascript: map_show_monger_by_name('{ba:id}'); return false;">
							<xsl:value-of select="ba:name"/>
							<xsl:if test="string-length(ba:nick)">
								<xsl:text> </xsl:text> (<xsl:value-of select="ba:nick"/>)
							</xsl:if>
						</a>
					</xsl:when>
					
					<xsl:otherwise>
						<a href="#{ba:id}">
							<xsl:value-of select="ba:name"/>
							<xsl:if test="string-length(ba:nick)">
								<xsl:text> </xsl:text> (<xsl:value-of select="ba:nick"/>)
							</xsl:if>
						</a>
					</xsl:otherwise>
					
				</xsl:choose>
			</li>
		
		</xsl:for-each>
	</ul>
	</td>
	
	<td><div id="googlemap"/></td>
	</tr></table>
	


	<h1>Mongers</h1>
	<div id="whoiswho">
		
		<table id="mongersTable">
					
			<xsl:apply-templates select="ba:monger">
				<xsl:sort select="ba:name" order="ascending"/>
			</xsl:apply-templates>

		</table>

	</div>


</xsl:template>



<xsl:template match="ba:monger">
	
	<!-- Add some spacing between the mongers -->
	<xsl:call-template name="comment-header">
		<xsl:with-param name="comment" select="ba:name"/>
	</xsl:call-template>


	<!-- The monger -->
	<tr id="{ba:id}">

		<td valign="top" class="picture">
			<xsl:if test="string-length(ba:nick)">
				<a name="{ba:id}">
					<!-- Hack, with this we get <a name=""></a> intead of <a name=""/> -->
					<xsl:comment/>
				</a>
			</xsl:if>
		

			<!-- Picture of the monger -->
			<img alt="{ba:name}">
				<xsl:attribute name="src">
				
					<xsl:choose>
						<xsl:when test="ba:picture">
							<xsl:value-of select="ba:picture"/>
						</xsl:when>
						
						<xsl:otherwise>http://search.cpan.org/s/img/who.jpg</xsl:otherwise>
					</xsl:choose>
				</xsl:attribute>
			</img>
			
			<!-- CPAN link -->
			<xsl:if test="ba:cpan">
				<div>
					<a href="{concat('http://search.cpan.org/~', ba:cpan, '/')}"><xsl:value-of select="ba:cpan"/></a>
				</div>
			</xsl:if>

		</td>


		<td valign="top">
			<h3>
				<xsl:value-of select="ba:name"/>
				<xsl:text> </xsl:text>
				<xsl:if test="ba:nick">
					(<xsl:value-of select="ba:nick"/>)
				</xsl:if>
			</h3>
			
			<p><xsl:value-of select="ba:place"/></p>
			
			<div>
			  <xsl:apply-templates mode="copy-without-namespaces" select="ba:info/html:*"/>
			</div>
		</td>

	</tr>

</xsl:template>

</xsl:stylesheet>
